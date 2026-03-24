const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

// Extract product title from a URL page using Firecrawl
async function extractTitleFromUrl(url: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: [{ type: 'json', prompt: 'Extract the product name/title from this page. Return just the product name as a simple string.' }],
        onlyMainContent: true,
      }),
    });
    const data = await response.json();
    const title = data?.data?.json?.product_name || data?.data?.json?.title || data?.data?.json?.name || data?.data?.metadata?.title || '';
    if (title) return title.replace(/ - Amazon\.in.*$/, '').replace(/ - Flipkart\.com.*$/, '').trim();
  } catch (e) {
    console.error('Title extraction error:', e);
  }
  return '';
}

// Scrape Amazon search results using Firecrawl JSON extraction
async function scrapeAmazon(query: string, apiKey: string): Promise<Product[]> {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    console.log('Scraping Amazon:', searchUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: [{
          type: 'json',
          prompt: `Extract the first 3 product results from this Amazon search page. For each product return: name (full product title), price (number only, no currency symbol, no commas), original_price (MRP/strikethrough price as number if available), rating (number like 4.2), reviews_count (number), product_url (the relative href path starting with /), image_url (the product image src). Return as an array of objects.`,
          schema: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    original_price: { type: 'number' },
                    rating: { type: 'number' },
                    reviews_count: { type: 'number' },
                    product_url: { type: 'string' },
                    image_url: { type: 'string' },
                  },
                  required: ['name', 'price'],
                },
              },
            },
            required: ['products'],
          },
        }],
        waitFor: 3000,
      }),
    });

    const data = await response.json();
    console.log('Amazon response status:', response.status);

    const products = data?.data?.json?.products || [];
    return products.slice(0, 3).map((p: any, i: number) => {
      let productUrl = p.product_url || '';
      if (productUrl && !productUrl.startsWith('http')) {
        productUrl = `https://www.amazon.in${productUrl}`;
      }
      if (!productUrl) {
        productUrl = searchUrl;
      }

      return {
        id: `amz_${i}`,
        name: p.name || query,
        price: p.price || 0,
        original_price: p.original_price || undefined,
        store: 'Amazon',
        store_logo: 'https://logo.clearbit.com/amazon.in',
        rating: p.rating || 0,
        reviews: p.reviews_count || 0,
        url: productUrl,
        image: p.image_url || '',
        availability: 'In Stock',
        brand: (p.name || '').split(' ')[0],
        is_best_price: false,
      };
    });
  } catch (e) {
    console.error('Amazon scrape error:', e);
    return [];
  }
}

// Scrape Flipkart search results using Firecrawl JSON extraction
async function scrapeFlipkart(query: string, apiKey: string): Promise<Product[]> {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    console.log('Scraping Flipkart:', searchUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: [{
          type: 'json',
          prompt: `Extract the first 3 product results from this Flipkart search page. For each product return: name (full product title), price (number only, no currency symbol, no commas), original_price (MRP/strikethrough price as number if available), rating (number like 4.2), reviews_count (number of ratings/reviews), product_url (the relative href path), image_url (the product image src). Return as an array of objects.`,
          schema: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    original_price: { type: 'number' },
                    rating: { type: 'number' },
                    reviews_count: { type: 'number' },
                    product_url: { type: 'string' },
                    image_url: { type: 'string' },
                  },
                  required: ['name', 'price'],
                },
              },
            },
            required: ['products'],
          },
        }],
        waitFor: 3000,
      }),
    });

    const data = await response.json();
    console.log('Flipkart response status:', response.status);

    const products = data?.data?.json?.products || [];
    return products.slice(0, 3).map((p: any, i: number) => {
      let productUrl = p.product_url || '';
      if (productUrl && !productUrl.startsWith('http')) {
        productUrl = `https://www.flipkart.com${productUrl}`;
      }
      if (!productUrl) {
        productUrl = searchUrl;
      }

      return {
        id: `fk_${i}`,
        name: p.name || query,
        price: p.price || 0,
        original_price: p.original_price || undefined,
        store: 'Flipkart',
        store_logo: 'https://logo.clearbit.com/flipkart.com',
        rating: p.rating || 0,
        reviews: p.reviews_count || 0,
        url: productUrl,
        image: p.image_url || '',
        availability: 'In Stock',
        brand: (p.name || '').split(' ')[0],
        is_best_price: false,
      };
    });
  } catch (e) {
    console.error('Flipkart scrape error:', e);
    return [];
  }
}

// Scrape Croma search results
async function scrapeCroma(query: string, apiKey: string): Promise<Product[]> {
  try {
    const searchUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}&text=${encodeURIComponent(query)}`;
    console.log('Scraping Croma:', searchUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: [{
          type: 'json',
          prompt: `Extract the first 3 product results from this Croma search page. For each product return: name (full product title), price (number only, no currency symbol, no commas), original_price (MRP as number if available), rating (number like 4.2), reviews_count (number), product_url (the product page href), image_url (the product image src). Return as an array of objects.`,
          schema: {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    price: { type: 'number' },
                    original_price: { type: 'number' },
                    rating: { type: 'number' },
                    reviews_count: { type: 'number' },
                    product_url: { type: 'string' },
                    image_url: { type: 'string' },
                  },
                  required: ['name', 'price'],
                },
              },
            },
            required: ['products'],
          },
        }],
        waitFor: 3000,
      }),
    });

    const data = await response.json();
    console.log('Croma response status:', response.status);

    const products = data?.data?.json?.products || [];
    return products.slice(0, 3).map((p: any, i: number) => {
      let productUrl = p.product_url || '';
      if (productUrl && !productUrl.startsWith('http')) {
        productUrl = `https://www.croma.com${productUrl}`;
      }
      if (!productUrl) {
        productUrl = searchUrl;
      }

      return {
        id: `croma_${i}`,
        name: p.name || query,
        price: p.price || 0,
        original_price: p.original_price || undefined,
        store: 'Croma',
        store_logo: 'https://logo.clearbit.com/croma.com',
        rating: p.rating || 0,
        reviews: p.reviews_count || 0,
        url: productUrl,
        image: p.image_url || '',
        availability: 'In Stock',
        brand: (p.name || '').split(' ')[0],
        is_best_price: false,
      };
    });
  } catch (e) {
    console.error('Croma scrape error:', e);
    return [];
  }
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

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ products: [], error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let searchQuery = query.trim();

    // If user pasted a URL, extract the product name first
    if (searchQuery.startsWith('http')) {
      console.log('Detected URL, extracting product title...');
      const extractedTitle = await extractTitleFromUrl(searchQuery, apiKey);
      if (extractedTitle) {
        console.log('Extracted title:', extractedTitle);
        searchQuery = extractedTitle;
      } else {
        // Fallback: try to extract from URL path
        try {
          const url = new URL(query);
          const pathParts = url.pathname.split('/').filter(Boolean);
          for (const part of pathParts) {
            if (part.length > 5 && !/^[A-Z0-9]{10}$/.test(part) && !part.includes('.')) {
              searchQuery = part.replace(/-/g, ' ').replace(/_/g, ' ');
              break;
            }
          }
        } catch { /* keep original */ }
      }
    }

    console.log('Searching for:', searchQuery);

    // Scrape all stores in parallel
    const [amazonProducts, flipkartProducts, cromaProducts] = await Promise.all([
      scrapeAmazon(searchQuery, apiKey),
      scrapeFlipkart(searchQuery, apiKey),
      scrapeCroma(searchQuery, apiKey),
    ]);

    let allProducts = [...amazonProducts, ...flipkartProducts, ...cromaProducts];

    // Filter out products with 0 price
    allProducts = allProducts.filter(p => p.price > 0);

    // Sort by price
    allProducts.sort((a, b) => a.price - b.price);

    // Mark best price
    if (allProducts.length > 0) {
      allProducts[0].is_best_price = true;
    }

    console.log(`Found ${allProducts.length} products total`);

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
