const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

// In-memory cache (persists across warm invocations)
const cache = new Map<string, { products: Product[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const PRODUCT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Full product title/name exactly as shown on the page' },
    price: { type: 'number', description: 'Current selling price in INR as a plain number without currency symbol, commas, or decimals. This is the final price the customer pays.' },
    original_price: { type: 'number', description: 'MRP or original price before discount in INR as a plain number. Only if a strikethrough/crossed-out price is shown.' },
    rating: { type: 'number', description: 'Product rating out of 5 (e.g. 4.2)' },
    reviews_count: { type: 'number', description: 'Total number of ratings or reviews as a number' },
    image_url: { type: 'string', description: 'URL of the main product image (the largest/primary product photo)' },
    availability: { type: 'string', description: 'Stock status like "In Stock" or "Out of Stock"' },
  },
  required: ['name', 'price'],
};

const STORE_CONFIGS = [
  {
    key: 'amazon',
    domain: 'amazon.in',
    store: 'Amazon',
    store_logo: 'https://logo.clearbit.com/amazon.in',
  },
  {
    key: 'flipkart',
    domain: 'flipkart.com',
    store: 'Flipkart',
    store_logo: 'https://logo.clearbit.com/flipkart.com',
  },
  {
    key: 'croma',
    domain: 'croma.com',
    store: 'Croma',
    store_logo: 'https://logo.clearbit.com/croma.com',
  },
] as const;

type StoreConfig = typeof STORE_CONFIGS[number];

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  store: string;
  store_logo: string;
  rating: number;
  reviews: number;
  url: string;
  image?: string;
  availability: string;
  brand: string;
  is_best_price: boolean;
}

function normalizeInputQuery(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}\/.*$/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function canonicalizeProductUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    if (hostname.endsWith('amazon.in')) {
      const dpIndex = pathParts.findIndex((part) => part.toLowerCase() === 'dp');
      if (dpIndex >= 0 && pathParts[dpIndex + 1]) {
        return `https://www.amazon.in/dp/${pathParts[dpIndex + 1]}`;
      }
    }

    if (hostname.endsWith('flipkart.com') || hostname.endsWith('croma.com')) {
      return `${parsed.origin}${parsed.pathname}`;
    }

    return url;
  } catch {
    return url;
  }
}

function deriveQueryFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname
      .split('/')
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));

    // For Amazon URLs like /Product-Name-Keywords/dp/ASIN, the first slug often has the product name
    const hostname = parsed.hostname.replace(/^www\./, '');
    if (hostname.endsWith('amazon.in') || hostname.endsWith('amazon.com')) {
      const dpIndex = parts.findIndex((p) => p.toLowerCase() === 'dp');
      if (dpIndex > 0) {
        // The part before /dp/ is usually the product slug
        const slug = parts[dpIndex - 1];
        if (slug && slug.length > 3 && !/^[a-z0-9]{8,20}$/i.test(slug)) {
          return slug.replace(/[-_]+/g, ' ').trim();
        }
      }
    }

    const candidate = parts.find((part) => {
      const normalized = part.toLowerCase();
      return (
        part.length > 5 &&
        !['dp', 'p', 'gp', 'product', 'products', 'search', 's'].includes(normalized) &&
        !/^[a-z0-9]{8,20}$/i.test(part)
      );
    });

    return candidate ? candidate.replace(/[-_]+/g, ' ').trim() : '';
  } catch {
    return '';
  }
}

function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function getStoreByUrl(url: string): StoreConfig | undefined {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return STORE_CONFIGS.find((store) => hostname.endsWith(store.domain));
  } catch {
    return undefined;
  }
}

function cleanProductName(name: string): string {
  return name
    .replace(/\s+:\s+Amazon\.in.*$/i, '')
    .replace(/\s+-\s+Amazon\.in.*$/i, '')
    .replace(/\s+-\s+Flipkart.*$/i, '')
    .replace(/\s+\|\s+Croma.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeNameForMatching(value: string): string {
  return cleanProductName(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(amazon|flipkart|croma|buy|online|india|with|and|for|the|fully|automatic)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateMatchScore(reference: string, candidate: string): number {
  const referenceTokens = new Set(normalizeNameForMatching(reference).split(' ').filter((t) => t.length > 1));
  const candidateTokens = new Set(normalizeNameForMatching(candidate).split(' ').filter((t) => t.length > 1));

  if (referenceTokens.size === 0 || candidateTokens.size === 0) return 0;

  let matches = 0;
  for (const token of referenceTokens) {
    if (candidateTokens.has(token)) matches += 1;
  }

  return matches / Math.max(referenceTokens.size, 1);
}

function isLikelyProductUrl(store: StoreConfig, url: string): boolean {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    if (!parsed.hostname.replace(/^www\./, '').endsWith(store.domain)) return false;
    if (store.key === 'amazon') return pathname.includes('/dp/');
    if (store.key === 'flipkart') return pathname.includes('/p/');
    if (store.key === 'croma') return pathname.includes('/p/');
    return true;
  } catch {
    return false;
  }
}

async function firecrawlRequest<T>(path: string, payload: Record<string, unknown>, apiKey: string, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${FIRECRAWL_BASE_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let data: unknown = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error(`Firecrawl ${path} returned invalid JSON: ${responseText.slice(0, 200)}`);
    }

    if (!response.ok) {
      throw new Error(`Firecrawl ${path} failed [${response.status}]: ${responseText.slice(0, 500)}`);
    }

    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

async function scrapeProductPage(url: string, store: StoreConfig, apiKey: string): Promise<{ product: Product | null; rawName: string }> {
  try {
    console.log(`Scraping ${store.store} product page:`, url);

    const storeHints: Record<string, string> = {
      amazon: 'Look for the price inside the "a-price-whole" or "priceBlockBuyingPriceString" element. The MRP/original price is usually shown with a strikethrough. The product title is in the "productTitle" span.',
      flipkart: 'Look for the selling price (usually the larger bold price). The original price has a strikethrough. Product title is the main heading.',
      croma: 'Look for the current selling price and any old/MRP price shown with strikethrough.',
    };

    // Use Firecrawl v1 scrape with extract format
    const data = await firecrawlRequest<any>(
      'scrape',
      {
        url,
        formats: ['extract'],
        extract: {
          prompt: `Extract the exact product details from this ${store.store} product page. ${storeHints[store.key] || ''} IMPORTANT: Return the EXACT current selling price as shown on the page - the price the customer would actually pay right now. Do NOT guess or estimate prices. Return price as a plain number without currency symbols or commas (e.g. 28990 not ₹28,990). For image_url, return the main product image URL.`,
          schema: PRODUCT_SCHEMA,
        },
        onlyMainContent: true,
        waitFor: 5000,
      },
      apiKey,
      25000,
    );

    // v1 response: extract data is in data.data.extract or data.extract
    const metadata = data?.data?.metadata || data?.metadata || {};
    const extracted = data?.data?.extract || data?.extract || data?.data?.json || data?.json || {};
    const rawName = cleanProductName(extracted.name || metadata.title || '');

    console.log(`${store.store} extracted:`, JSON.stringify({ name: rawName, price: extracted.price, image: extracted.image_url?.substring(0, 50) }));

    if (!rawName) return { product: null, rawName: '' };

    const price = Number(extracted.price || 0);
    if (!Number.isFinite(price) || price <= 0) return { product: null, rawName };

    return {
      rawName,
      product: {
        id: `${store.key}_${crypto.randomUUID()}`,
        name: rawName,
        price,
        original_price: extracted.original_price && extracted.original_price > price ? extracted.original_price : undefined,
        store: store.store,
        store_logo: store.store_logo,
        rating: Number(extracted.rating || 0),
        reviews: Number(extracted.reviews_count || 0),
        url: metadata?.sourceURL || metadata?.url || url,
        image: extracted.image_url || '',
        availability: extracted.availability || 'In Stock',
        brand: rawName.split(' ')[0] || store.store,
        is_best_price: false,
      },
    };
  } catch (error) {
    console.error(`${store.store} scrape error:`, error);
    return { product: null, rawName: '' };
  }
}

async function searchStoreProducts(store: StoreConfig, referenceName: string, apiKey: string): Promise<Product | null> {
  try {
    // v1 search endpoint
    const data = await firecrawlRequest<any>(
      'search',
      {
        query: `site:${store.domain} ${referenceName}`,
        limit: 5,
      },
      apiKey,
      10000,
    );

    // v1 response: results are in data.data array
    const results: any[] = data?.data || [];
    console.log(`${store.store} search returned ${results.length} results`);

    const bestCandidate = results
      .filter((r: any) => r.url && isLikelyProductUrl(store, r.url))
      .map((r: any) => ({
        url: r.url,
        score: calculateMatchScore(referenceName, [r.title, r.description].filter(Boolean).join(' ')),
      }))
      .filter((item) => item.score >= 0.25)
      .sort((a, b) => b.score - a.score)[0];

    if (!bestCandidate?.url) {
      console.log(`${store.store}: no matching product URL found`);
      return null;
    }

    console.log(`${store.store}: best candidate URL: ${bestCandidate.url} (score: ${bestCandidate.score})`);
    const scraped = await scrapeProductPage(bestCandidate.url, store, apiKey);
    if (!scraped.product) return null;

    const matchScore = calculateMatchScore(referenceName, scraped.rawName);
    console.log(`${store.store} final match score: ${matchScore}`);
    if (matchScore >= 0.25) {
      return scraped.product;
    }
  } catch (error) {
    console.error(`${store.store} search error:`, error);
  }
  return null;
}

async function resolveProductForStore(
  store: StoreConfig,
  referenceName: string,
  apiKey: string,
  exactUrl?: string,
): Promise<Product | null> {
  if (exactUrl) {
    const direct = await scrapeProductPage(exactUrl, store, apiKey);
    if (direct.product) return direct.product;
  }
  return await searchStoreProducts(store, referenceName, apiKey);
}

async function buildComparisonProducts(query: string, apiKey: string): Promise<Product[]> {
  const normalizedQuery = normalizeInputQuery(query);
  const queryIsUrl = isLikelyUrl(normalizedQuery);
  const canonicalQuery = queryIsUrl ? canonicalizeProductUrl(normalizedQuery) : normalizedQuery;
  const sourceStore = queryIsUrl ? getStoreByUrl(canonicalQuery) : undefined;

  let referenceName = queryIsUrl ? deriveQueryFromUrl(canonicalQuery) : normalizedQuery;
  let sourceProduct: Product | null = null;

  // If it's a product URL from a supported store, scrape it first to get the real product name
  if (queryIsUrl && sourceStore && isLikelyProductUrl(sourceStore, canonicalQuery)) {
    console.log('Detected supported product URL, scraping source product...');
    const sourceScrape = await scrapeProductPage(canonicalQuery, sourceStore, apiKey);
    sourceProduct = sourceScrape.product;
    if (sourceScrape.rawName) {
      referenceName = sourceScrape.rawName;
    }
  }

  console.log('Searching across stores for:', referenceName);

  // Search all stores in parallel
  const products = await Promise.all(
    STORE_CONFIGS.map((store) =>
      resolveProductForStore(
        store,
        referenceName,
        apiKey,
        sourceStore?.key === store.key ? canonicalQuery : undefined,
      )
    )
  );

  const deduped = new Map<string, Product>();
  for (const product of products) {
    if (product) deduped.set(product.store, product);
  }

  if (sourceProduct && !deduped.has(sourceProduct.store)) {
    deduped.set(sourceProduct.store, sourceProduct);
  }

  return Array.from(deduped.values());
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ products: [], error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check cache first
    const cacheKey = query.trim().toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      console.log('Cache hit for:', cacheKey);
      return new Response(
        JSON.stringify({ products: cached.products }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ products: [], error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let allProducts = await buildComparisonProducts(query, apiKey);
    allProducts = allProducts.filter((p) => p.price > 0);
    allProducts.sort((a, b) => a.price - b.price);

    if (allProducts.length > 0) {
      allProducts[0].is_best_price = true;
    }

    console.log(`Found ${allProducts.length} products total`);

    // Store in cache
    if (allProducts.length > 0) {
      cache.set(cacheKey, { products: allProducts, ts: Date.now() });
      // Evict old entries if cache grows too large
      if (cache.size > 100) {
        const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
        if (oldest) cache.delete(oldest[0]);
      }
    }

    return new Response(
      JSON.stringify({ products: allProducts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ products: [], error: error instanceof Error ? error.message : 'Search failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
