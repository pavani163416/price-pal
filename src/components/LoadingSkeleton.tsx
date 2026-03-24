const LoadingSkeleton = () => (
  <section className="container mx-auto px-4 py-10">
    <div className="mb-6">
      <div className="h-8 w-64 animate-pulse-subtle rounded-lg bg-muted" />
      <div className="mt-2 h-4 w-40 animate-pulse-subtle rounded bg-muted" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex h-24 animate-pulse-subtle items-center gap-4 rounded-xl border border-border bg-card p-5"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="h-10 w-28 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
    <p className="mt-6 text-center font-body text-sm text-muted-foreground">
      Searching multiple stores for the best prices…
    </p>
  </section>
);

export default LoadingSkeleton;
