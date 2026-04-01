import { Search, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const FloatingOrb = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`pointer-events-none absolute ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 0.95, 1],
    }}
    transition={{
      duration: 10,
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
    <section className="relative overflow-hidden bg-background py-28 md:py-36">
      {/* Layered backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 noise" />

      {/* Large neon orbs */}
      <FloatingOrb
        className="-left-40 -top-20 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-primary/15 to-primary/5 blur-[100px]"
        delay={0}
      />
      <FloatingOrb
        className="-right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-secondary/15 to-neon-purple/5 blur-[100px]"
        delay={3}
      />
      <FloatingOrb
        className="left-1/3 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-neon-cyan/10 to-primary/5 blur-[80px]"
        delay={5}
      />

      {/* 3D geometric shapes */}
      <FloatingOrb
        className="left-[6%] top-[15%] h-20 w-20 rotate-45 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
        delay={1}
      />
      <FloatingOrb
        className="right-[10%] top-[20%] h-14 w-14 rotate-12 rounded-xl border border-secondary/20 bg-secondary/5 backdrop-blur-sm shadow-[0_0_15px_hsl(var(--secondary)/0.1)]"
        delay={4}
      />
      <FloatingOrb
        className="bottom-[15%] left-[12%] h-12 w-12 -rotate-12 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 backdrop-blur-sm"
        delay={2}
      />
      <FloatingOrb
        className="bottom-[20%] right-[6%] h-16 w-16 rotate-[30deg] rounded-2xl border border-accent/15 bg-accent/5 backdrop-blur-sm shadow-[0_0_20px_hsl(var(--accent)/0.1)]"
        delay={6}
      />

      {/* Horizontal neon lines */}
      <div className="pointer-events-none absolute left-0 top-1/3 w-full neon-line opacity-40" />
      <div className="pointer-events-none absolute left-0 bottom-1/4 w-full neon-line opacity-20" />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full glow-border bg-primary/5 px-5 py-2 font-body text-xs font-semibold uppercase tracking-widest text-primary"
            animate={{
              boxShadow: [
                "0 0 15px hsl(var(--primary) / 0.15), inset 0 0 15px hsl(var(--primary) / 0.05)",
                "0 0 30px hsl(var(--primary) / 0.25), inset 0 0 20px hsl(var(--primary) / 0.08)",
                "0 0 15px hsl(var(--primary) / 0.15), inset 0 0 15px hsl(var(--primary) / 0.05)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Price Comparison
          </motion.div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find the{" "}
            <span className="text-gradient">Best Price</span>
            <br className="hidden sm:block" />
            {" "}Instantly
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
            Paste a product link or search by name — we compare prices across
            Amazon, Flipkart, Croma & more in seconds.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="group mx-auto mt-12 flex max-w-2xl overflow-hidden rounded-2xl glass-card shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.15)] transition-all duration-500 focus-within:shadow-[0_0_50px_-10px_hsl(var(--primary)/0.3),0_20px_60px_-15px_hsl(var(--primary)/0.2)] focus-within:border-primary/40"
        >
          <div className="flex flex-1 items-center gap-3 px-5">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary group-focus-within:drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste product URL or type product name…"
              className="w-full bg-transparent py-4.5 font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="m-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 btn-press"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                />
                Searching…
              </span>
            ) : (
              "Compare Prices"
            )}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span className="text-muted-foreground/60">Try:</span>
          {["iPhone 15 Pro Max", "Samsung Galaxy S24", "Sony WH-1000XM5"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  onSearch(item);
                }}
                className="rounded-full border border-border/50 bg-muted/30 px-3.5 py-1.5 backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)] btn-press"
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
