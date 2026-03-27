import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ComparisonResults from "@/components/ComparisonResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Footer from "@/components/Footer";
import { searchProducts, type Product } from "@/lib/api";

const Compare = () => {
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
      <section className="relative overflow-hidden bg-card py-12">
        <div className="pointer-events-none absolute inset-0 animated-gradient" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container relative mx-auto px-4 text-center"
        >
          <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Compare <span className="text-gradient">Prices</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl font-body text-muted-foreground">
            Paste a product link or search by name to compare prices across stores.
          </p>
        </motion.div>
      </section>
      <HeroSearch onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}
      {!isLoading && hasSearched && products.length > 0 && (
        <ComparisonResults products={products} query={query} />
      )}
      {!isLoading && hasSearched && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-16 text-center"
        >
          <p className="font-body text-lg text-muted-foreground">
            No results found. Try a different product name or URL.
          </p>
        </motion.div>
      )}

      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default Compare;
