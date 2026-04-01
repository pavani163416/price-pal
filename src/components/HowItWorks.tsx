import { Link2, BarChart3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link2,
    title: "Paste or Search",
    description: "Enter a product URL or name in the search bar.",
    gradient: "from-primary to-neon-cyan",
    glowColor: "--primary",
  },
  {
    icon: BarChart3,
    title: "Compare Prices",
    description: "We scan multiple e-commerce stores and show real-time prices.",
    gradient: "from-secondary to-neon-purple",
    glowColor: "--secondary",
  },
  {
    icon: ExternalLink,
    title: "Get the Best Deal",
    description: "Click 'View Deal' to go directly to the store with the lowest price.",
    gradient: "from-accent to-neon-pink",
    glowColor: "--accent",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative overflow-hidden border-t border-border/30 bg-background py-24">
    <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
    <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

    {/* Floating orbs */}
    <motion.div
      className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/8 blur-[80px]"
      animate={{ y: [0, -25, 0] }}
      transition={{ duration: 10, repeat: Infinity }}
    />
    <motion.div
      className="pointer-events-none absolute -right-20 bottom-1/4 h-56 w-56 rounded-full bg-secondary/8 blur-[80px]"
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, delay: 3 }}
    />

    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="mx-auto mb-4 inline-block rounded-full glow-border bg-primary/5 px-5 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-primary">
          Simple Steps
        </span>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          How It <span className="text-gradient">Works</span>
        </h2>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7 }}
            whileHover={{
              y: -12,
              rotateX: 5,
              rotateY: -3,
              scale: 1.03,
              transition: { duration: 0.3 },
            }}
            className="group relative flex flex-col items-center rounded-2xl glass-card p-8 text-center transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsl(var(${step.glowColor})/0.25)]"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            {/* Corner accent */}
            <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Hover glow */}
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(500px circle at 50% 0%, hsl(var(${step.glowColor}) / 0.15), transparent 60%)`,
              }}
            />

            <div
              className={`relative flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-[0_0_25px_-5px_hsl(var(${step.glowColor})/0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_35px_-5px_hsl(var(${step.glowColor})/0.6)]`}
            >
              <step.icon className="h-8 w-8 text-primary-foreground" />
            </div>

            <h3 className="mt-6 font-display text-lg font-bold text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>

            <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 font-display text-sm font-bold text-primary ring-2 ring-primary/20 transition-all group-hover:ring-primary/40 group-hover:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]">
              {i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
