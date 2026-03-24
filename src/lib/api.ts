import { supabase } from "@/integrations/supabase/client";

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

export async function searchProducts(query: string): Promise<SearchResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('product-search', {
      body: { query },
    });

    if (error) {
      console.error('Edge function error:', error);
      return { products: [] };
    }

    return data as SearchResponse;
  } catch (error) {
    console.error('Search failed:', error);
    return { products: [] };
  }
}
