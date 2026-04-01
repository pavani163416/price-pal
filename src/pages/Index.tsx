import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ComparisonResults from "@/components/ComparisonResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { searchProducts, type Product } from "@/lib/api";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    setHasSearched(true);

    const data = await searchProducts(searchQuery);
    setProducts(data.products);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSearch onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}
      {!isLoading && hasSearched && products.length > 0 && (
        <ComparisonResults products={products} query={query} />
      )}
      {!isLoading && hasSearched && products.length === 0 && (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="font-body text-lg text-muted-foreground">
            No results found. Try a different product name or URL.
          </p>
        </div>
      )}

      {!hasSearched && <HowItWorks />}
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Index;
