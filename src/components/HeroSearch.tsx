import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const HeroSearch = ({ onSearch, isLoading }: HeroSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="relative overflow-hidden bg-card py-20">
      {/* Layered background */}
      <div className="animated-gradient pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/8 blur-3xl float-animation" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-secondary/8 blur-3xl float-animation" style={{ animationDelay: "-3s" }} />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-accent/8 blur-2xl float-animation" style={{ animationDelay: "-1.5s" }} />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-body text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Price Comparison
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Find the <span className="text-gradient">Best Price</span> Instantly
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
            Paste a product link or search by name — we compare prices across
            Amazon, Flipkart, Croma & more in seconds.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.12),0_8px_24px_-8px_hsl(var(--foreground)/0.05)] transition-all focus-within:ring-2 focus-within:ring-primary/40 focus-within:shadow-[0_24px_70px_-15px_hsl(var(--primary)/0.2)]"
        >
          <div className="flex flex-1 items-center gap-3 px-5">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste product URL or type product name…"
              className="w-full bg-transparent py-4 font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="m-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_8px_28px_-4px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? "Searching…" : "Compare Prices"}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span>Try:</span>
          {["iPhone 15 Pro Max", "Samsung Galaxy S24", "Sony WH-1000XM5"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  onSearch(item);
                }}
                className="rounded-full border border-border bg-muted px-3 py-1 transition-all hover:border-primary/40 hover:text-foreground hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-sm"
              >
                {item}
              </button>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSearch;
