import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const FloatingShape = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`pointer-events-none absolute ${className}`}
    animate={{
      y: [0, -25, 0],
      rotate: [0, 8, -8, 0],
      scale: [1, 1.08, 1],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

const HeroSearch = ({ onSearch, isLoading }: HeroSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <section className="relative overflow-hidden bg-card py-24 md:py-32">
      {/* Multi-layer background */}
      <div className="animated-gradient pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      {/* Large floating 3D orbs with motion */}
      <FloatingShape
        className="-left-32 -top-16 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl"
        delay={0}
      />
      <FloatingShape
        className="-right-24 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tl from-secondary/12 to-secondary/4 blur-3xl"
        delay={2}
      />
      <FloatingShape
        className="left-1/4 top-1/4 h-52 w-52 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 blur-2xl"
        delay={4}
      />
      <FloatingShape
        className="right-1/4 top-1/3 h-36 w-36 rounded-full bg-gradient-to-br from-primary/8 to-secondary/8 blur-2xl"
        delay={1.5}
      />

      {/* 3D geometric shapes */}
      <FloatingShape
        className="left-[8%] top-[18%] h-16 w-16 rotate-45 rounded-xl border border-primary/15 bg-primary/5 backdrop-blur-sm"
        delay={0.5}
      />
      <FloatingShape
        className="right-[12%] top-[22%] h-12 w-12 rotate-12 rounded-lg border border-secondary/15 bg-secondary/5 backdrop-blur-sm"
        delay={3}
      />
      <FloatingShape
        className="bottom-[20%] left-[15%] h-10 w-10 -rotate-12 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm"
        delay={1}
      />
      <FloatingShape
        className="bottom-[25%] right-[8%] h-14 w-14 rotate-[30deg] rounded-xl border border-primary/10 bg-primary/5 backdrop-blur-sm"
        delay={2.5}
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-primary shadow-[0_0_20px_-4px_hsl(var(--primary)/0.2)]"
            animate={{ boxShadow: ["0 0 20px -4px hsl(var(--primary) / 0.15)", "0 0 35px -4px hsl(var(--primary) / 0.25)", "0 0 20px -4px hsl(var(--primary) / 0.15)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Price Comparison
          </motion.div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Find the <span className="text-gradient">Best Price</span> Instantly
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Paste a product link or search by name — we compare prices across
            Amazon, Flipkart, Croma & more in seconds.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur-md shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.12),0_8px_24px_-8px_hsl(var(--foreground)/0.05)] transition-all duration-500 focus-within:ring-2 focus-within:ring-primary/40 focus-within:shadow-[0_24px_70px_-15px_hsl(var(--primary)/0.25),0_0_40px_-10px_hsl(var(--primary)/0.1)] focus-within:border-primary/30"
        >
          <div className="flex flex-1 items-center gap-3 px-5">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />
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
          className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
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
                className="rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur-sm transition-all hover:border-primary/40 hover:text-foreground hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_-4px_hsl(var(--primary)/0.2)]"
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
