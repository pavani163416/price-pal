export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  store: string;
  store_logo?: string;
  rating: number;
  reviews: number;
  url: string;
  image?: string;
  availability: string;
  brand: string;
  is_best_price?: boolean;
}

export interface SearchResponse {
  products: Product[];
}

// Store configurations with real search URL patterns
const STORES = [
  {
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.in",
    searchUrl: (q: string) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
    ratingRange: [3.8, 4.6],
    reviewRange: [800, 12000],
    priceMultiplier: 1.0, // base price
  },
  {
    name: "Flipkart",
    logo: "https://logo.clearbit.com/flipkart.com",
    searchUrl: (q: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
    ratingRange: [3.7, 4.5],
    reviewRange: [600, 9000],
    priceMultiplier: 1.02,
  },
  {
    name: "Croma",
    logo: "https://logo.clearbit.com/croma.com",
    searchUrl: (q: string) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}`,
    ratingRange: [3.5, 4.3],
    reviewRange: [100, 2000],
    priceMultiplier: 1.08,
  },
  {
    name: "Reliance Digital",
    logo: "https://logo.clearbit.com/reliancedigital.in",
    searchUrl: (q: string) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}`,
    ratingRange: [3.6, 4.2],
    reviewRange: [50, 1500],
    priceMultiplier: 1.1,
  },
  {
    name: "Vijay Sales",
    logo: "https://logo.clearbit.com/vijaysales.com",
    searchUrl: (q: string) => `https://www.vijaysales.com/search/${encodeURIComponent(q)}`,
    ratingRange: [3.4, 4.1],
    reviewRange: [30, 800],
    priceMultiplier: 1.15,
  },
];

// Known product price ranges for realistic demo data
const PRODUCT_PRICES: Record<string, { base: number; mrp: number }> = {
  "iphone 15 pro max": { base: 134900, mrp: 159900 },
  "iphone 15 pro": { base: 119900, mrp: 139900 },
  "iphone 15": { base: 69900, mrp: 79900 },
  "iphone 14": { base: 52999, mrp: 69900 },
  "iphone 13": { base: 43999, mrp: 59900 },
  "samsung galaxy s24": { base: 64999, mrp: 79999 },
  "samsung galaxy s24 ultra": { base: 129999, mrp: 144999 },
  "samsung galaxy s23": { base: 39999, mrp: 74999 },
  "oneplus 12": { base: 59999, mrp: 69999 },
  "pixel 8": { base: 52999, mrp: 75999 },
  "sony wh-1000xm5": { base: 22990, mrp: 34990 },
  "airpods pro": { base: 20900, mrp: 26900 },
  "macbook air m2": { base: 99900, mrp: 119900 },
  "macbook pro m3": { base: 164900, mrp: 199900 },
  "ipad air": { base: 59900, mrp: 69900 },
  "ps5": { base: 44990, mrp: 54990 },
  "default": { base: 15999, mrp: 24999 },
};

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + index.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function getBasePrice(query: string): { base: number; mrp: number } {
  const q = query.toLowerCase().trim();
  for (const [key, val] of Object.entries(PRODUCT_PRICES)) {
    if (key === "default") continue;
    if (q.includes(key) || key.includes(q)) return val;
  }
  // Generate a reasonable price based on query hash
  const hash = seededRandom(q, 999);
  const base = Math.round((5000 + hash * 145000) / 100) * 100;
  return { base, mrp: Math.round(base * 1.3 / 100) * 100 };
}

function extractProductName(url: string): string {
  try {
    const u = new URL(url);
    // Try to extract from URL path
    const pathParts = u.pathname.split("/").filter(Boolean);
    for (const part of pathParts) {
      if (part.length > 10 && !part.match(/^[A-Z0-9]{10}$/)) {
        return part.replace(/-/g, " ").replace(/_/g, " ");
      }
    }
    // Fallback to search params
    return u.searchParams.get("q") || u.searchParams.get("k") || "product";
  } catch {
    return "product";
  }
}

function generateProducts(query: string): Product[] {
  const isUrl = query.startsWith("http");
  const productName = isUrl ? extractProductName(query) : query;
  const { base, mrp } = getBasePrice(productName);

  return STORES.map((store, i) => {
    const rand = seededRandom(productName + store.name, i);
    const priceVariation = 1 + (rand - 0.5) * 0.12; // ±6% variation
    const price = Math.round(base * store.priceMultiplier * priceVariation / 10) * 10;
    const rating = +(store.ratingRange[0] + rand * (store.ratingRange[1] - store.ratingRange[0])).toFixed(1);
    const reviews = Math.round(store.reviewRange[0] + rand * (store.reviewRange[1] - store.reviewRange[0]));

    // For URL queries, preserve the original URL for the matching store
    let url = store.searchUrl(productName);
    if (isUrl) {
      try {
        const hostname = new URL(query).hostname;
        if (hostname.includes(store.name.toLowerCase().replace(/\s/g, ""))) {
          url = query;
        }
      } catch { /* ignore */ }
    }

    return {
      id: `${store.name.toLowerCase().replace(/\s/g, "")}_${i}`,
      name: productName,
      price,
      original_price: mrp,
      store: store.name,
      store_logo: store.logo,
      rating,
      reviews,
      url,
      availability: rand > 0.15 ? "In Stock" : "Limited Stock",
      brand: productName.split(" ")[0],
      is_best_price: false,
    };
  });
}

export async function searchProducts(query: string): Promise<SearchResponse> {
  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

  const products = generateProducts(query);

  // Sort by price and mark best deal
  products.sort((a, b) => a.price - b.price);
  if (products.length > 0) {
    products[0].is_best_price = true;
  }

  return { products };
}
