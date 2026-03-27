import { ExternalLink, Star, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.08 }}
      className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.12)] hover:-translate-y-1 hover:border-primary/20"
    >
      {product.is_best_price && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-3 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-[0_4px_12px_-2px_hsl(var(--accent)/0.4)]">
          Best Price
        </span>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 font-display text-sm font-bold text-primary">
          {rank}
        </div>

        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted transition-transform duration-300 group-hover:scale-105">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 min-w-0">
          <h3 className="font-display text-sm font-bold text-foreground leading-snug line-clamp-2">
            {product.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {product.store_logo ? (
              <img
                src={product.store_logo}
                alt={product.store}
                className="h-5 w-5 rounded object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span className="font-medium">{product.store}</span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>{product.rating}</span>
            </div>
            <span>·</span>
            <span>{product.reviews.toLocaleString()} reviews</span>
          </div>

          <span
            className={`w-fit rounded-full px-2.5 py-0.5 font-body text-[11px] font-medium ${
              product.availability === "In Stock"
                ? "bg-primary/10 text-primary"
                : "bg-accent/20 text-accent-foreground"
            }`}
          >
            {product.availability}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
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
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_8px_28px_-4px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0"
          >
            View Deal
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
