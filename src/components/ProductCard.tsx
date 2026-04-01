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

  const isOutOfStock =
    product.availability === "Out of Stock" || product.availability === "Unavailable";

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.08 }}
      whileHover={{
        y: -4,
        rotateX: 2,
        transition: { duration: 0.3 },
      }}
      className="group relative rounded-2xl glass-card p-5 transition-all duration-400 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.15)] hover:border-primary/30"
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
    >
      {product.is_best_price && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-3 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_15px_-2px_hsl(var(--primary)/0.5)]">
          Best Price
        </span>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Rank */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 font-display text-sm font-bold text-primary ring-1 ring-primary/20">
          {rank}
        </div>

        {/* Image */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.15)]">
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
            <ImageOff className="h-8 w-8 text-muted-foreground/40" />
          )}
        </div>

        {/* Info */}
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
            <span className="text-border">·</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>{product.rating}</span>
            </div>
            <span className="text-border">·</span>
            <span>{product.reviews.toLocaleString()} reviews</span>
          </div>

          <span
            className={`w-fit rounded-full px-2.5 py-0.5 font-body text-[11px] font-medium ${
              isOutOfStock
                ? "bg-destructive/15 text-destructive border border-destructive/20"
                : product.availability === "In Stock"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-accent/10 text-accent border border-accent/20"
            }`}
          >
            {isOutOfStock ? "❌ Out of Stock" : product.availability}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.original_price && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
              <span className="font-semibold text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.3)]">
                {discount}% off
              </span>
            </div>
          )}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 btn-press"
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
