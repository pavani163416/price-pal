import { Link2, BarChart3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link2,
    title: "Paste or Search",
    description: "Enter a product URL or name in the search bar.",
    gradient: "from-primary to-secondary",
    glow: "hsl(var(--primary) / 0.25)",
  },
  {
    icon: BarChart3,
    title: "Compare Prices",
    description: "We scan multiple e-commerce stores and show real-time prices.",
    gradient: "from-secondary to-accent",
    glow: "hsl(var(--secondary) / 0.25)",
  },
  {
    icon: ExternalLink,
    title: "Get the Best Deal",
    description: "Click 'View Deal' to go directly to the store with the lowest price.",
    gradient: "from-accent to-primary",
    glow: "hsl(var(--accent) / 0.25)",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative overflow-hidden border-t border-border bg-muted/30 py-20">
    <div className="pointer-events-none absolute inset-0 animated-gradient opacity-40" />
    <div className="pointer-events-none absolute inset-0 bg-mesh" />

    {/* Floating accents */}
    <motion.div
      className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-primary/6 blur-3xl"
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    <motion.div
      className="pointer-events-none absolute -right-16 bottom-1/4 h-48 w-48 rounded-full bg-secondary/6 blur-3xl"
      animate={{ y: [0, 15, 0] }}
      transition={{ duration: 6, repeat: Infinity, delay: 2 }}
    />

    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="mx-auto mb-3 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1 font-body text-xs font-semibold uppercase tracking-wider text-primary">
          Simple Steps
        </span>
        <h2 className="font-display text-3xl font-bold text-foreground">
          How It <span className="text-gradient">Works</span>
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotateX: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -10, rotateX: 4, scale: 1.02 }}
            className="group relative flex flex-col items-center rounded-2xl border border-border bg-card/80 p-8 text-center backdrop-blur-sm shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)] transition-shadow duration-500 hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.15)]"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(400px circle at 50% 0%, ${step.glow}, transparent 70%)`,
              }}
            />

            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-[0_8px_24px_-6px_hsl(var(--primary)/0.3)] transition-transform duration-300 group-hover:scale-110`}
            >
              <step.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
            <div className="mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 font-display text-sm font-bold text-primary ring-2 ring-primary/10">
              {i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
