import { Search } from "lucide-react";
import { useState } from "react";

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
    <section className="bg-card py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Find the <span className="text-primary">Best Price</span> Instantly
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted-foreground">
          Paste a product link or search by name — we compare prices across
          Amazon, Flipkart, Croma & more in seconds.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary/40"
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
            className="m-2 rounded-lg bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Searching…" : "Compare Prices"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Try:</span>
          {["iPhone 15 Pro Max", "Samsung Galaxy S24", "Sony WH-1000XM5"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  onSearch(item);
                }}
                className="rounded-full border border-border bg-muted px-3 py-1 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
