import { ArrowDownUp, Trophy, TrendingDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/api";
import ProductCard from "./ProductCard";

interface ComparisonResultsProps {
  products: Product[];
  query: string;
}

type SortKey = "price-asc" | "price-desc" | "rating";

const ComparisonResults = ({ products, query }: ComparisonResultsProps) => {
  const [sort, setSort] = useState<SortKey>("price-asc");

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.rating - a.rating;
  });

  const bestProduct = [...products].sort((a, b) => a.price - b.price)[0];

  const savings =
    products.length > 1
      ? Math.max(...products.map((p) => p.price)) -
        Math.min(...products.map((p) => p.price))
      : 0;

  const formatPrice = (p: number) => "₹" + p.toLocaleString("en-IN");

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Best Price Hero Card */}
      {bestProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-card to-primary/5 p-6 shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.15)] transition-shadow hover:shadow-[0_24px_60px_-12px_hsl(var(--primary)/0.2)]"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {bestProduct.image ? (
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-2 transition-transform hover:scale-105">
                <img
                  src={bestProduct.image}
                  alt={bestProduct.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
                    Lowest Price Found
                  </span>
                </div>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground leading-snug line-clamp-2">
                {bestProduct.name}
              </h2>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="font-display text-3xl font-extrabold text-gradient">
                  {formatPrice(bestProduct.price)}
                </span>
                {bestProduct.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(bestProduct.original_price)}
                  </span>
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  on {bestProduct.store}
                </span>
              </div>
              {savings > 0 && (
                <p className="flex items-center gap-1.5 font-body text-sm text-muted-foreground justify-center sm:justify-start">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  Save up to{" "}
                  <span className="font-semibold text-primary">
                    {formatPrice(savings)}
                  </span>{" "}
                  compared to other stores
                </p>
              )}
            </div>
            <a
              href={bestProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_8px_28px_-4px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Buy at Best Price
            </a>
          </div>
        </motion.div>
      )}

      {/* Sort & Store List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Price Comparison ({products.length} stores)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: Best First</option>
          </select>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        {sorted.map((product, i) => (
          <ProductCard key={product.id} product={product} rank={i + 1} />
        ))}
      </div>
    </section>
  );
};

export default ComparisonResults;
