import { ArrowDownUp } from "lucide-react";
import { useState } from "react";
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

  const savings =
    products.length > 1
      ? Math.max(...products.map((p) => p.price)) -
        Math.min(...products.map((p) => p.price))
      : 0;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Results for "{query}"
          </h2>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Found {products.length} stores
            {savings > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-primary">
                  Save up to ₹{savings.toLocaleString("en-IN")}
                </span>
              </>
            )}
          </p>
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
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((product, i) => (
          <ProductCard key={product.id} product={product} rank={i + 1} />
        ))}
      </div>
    </section>
  );
};

export default ComparisonResults;
