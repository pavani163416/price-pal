import { ExternalLink, Star } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  rank: number;
}

const ProductCard = ({ product, rank }: ProductCardProps) => {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const formatPrice = (p: number) =>
    "₹" + p.toLocaleString("en-IN");

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
        {rank}
      </div>

      <div className="flex flex-1 items-center gap-4">
        {product.store_logo ? (
          <img
            src={product.store_logo}
            alt={product.store}
            className="h-10 w-10 rounded-lg border border-border object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted font-display text-xs font-bold text-muted-foreground">
            {product.store.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-foreground">
            {product.store}
          </p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span>{product.rating}</span>
            <span>·</span>
            <span>{product.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 font-body text-xs font-medium ${
          product.availability === "In Stock"
            ? "bg-primary/10 text-primary"
            : "bg-accent/20 text-accent-foreground"
        }`}
      >
        {product.availability}
      </span>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="font-display text-xl font-bold text-foreground">
          {formatPrice(product.price)}
        </span>
        {product.original_price && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
            <span className="font-semibold text-primary">
              {discount}% off
            </span>
          </div>
        )}
      </div>

      {product.is_best_price && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-3 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
          Best Price
        </span>
      )}

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        View Deal
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

export default ProductCard;
