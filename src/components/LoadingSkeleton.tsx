import { motion } from "framer-motion";

const LoadingSkeleton = () => (
  <section className="container mx-auto px-4 py-10">
    <div className="mb-6">
      <div className="h-8 w-64 rounded-lg bg-muted/50 shimmer" />
      <div className="mt-2 h-4 w-40 rounded bg-muted/50 shimmer" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex h-24 items-center gap-4 rounded-2xl glass-card p-5"
        >
          <div className="h-9 w-9 rounded-full bg-muted/50 shimmer" />
          <div className="h-12 w-12 rounded-xl bg-muted/50 shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted/50 shimmer" />
            <div className="h-3 w-24 rounded bg-muted/50 shimmer" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted/50 shimmer" />
          <div className="h-6 w-24 rounded bg-muted/50 shimmer" />
          <div className="h-10 w-28 rounded-xl bg-primary/20 shimmer" />
        </motion.div>
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 flex flex-col items-center gap-4"
    >
      {/* 3D spinner */}
      <div className="relative h-12 w-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-b-secondary border-l-transparent border-r-transparent border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="font-body text-sm text-muted-foreground">
        Searching multiple stores for the best prices…
      </p>
    </motion.div>
  </section>
);

export default LoadingSkeleton;
