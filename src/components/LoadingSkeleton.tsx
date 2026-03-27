import { motion } from "framer-motion";

const LoadingSkeleton = () => (
  <section className="container mx-auto px-4 py-10">
    <div className="mb-6">
      <div className="h-8 w-64 rounded-lg bg-muted shimmer" />
      <div className="mt-2 h-4 w-40 rounded bg-muted shimmer" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex h-24 items-center gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="h-8 w-8 rounded-full bg-muted shimmer" />
          <div className="h-10 w-10 rounded-lg bg-muted shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted shimmer" />
            <div className="h-3 w-24 rounded bg-muted shimmer" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted shimmer" />
          <div className="h-6 w-24 rounded bg-muted shimmer" />
          <div className="h-10 w-28 rounded-lg bg-muted shimmer" />
        </motion.div>
      ))}
    </div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-6 text-center font-body text-sm text-muted-foreground"
    >
      Searching multiple stores for the best prices…
    </motion.p>
  </section>
);

export default LoadingSkeleton;
