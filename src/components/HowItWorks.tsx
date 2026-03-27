import { Link2, BarChart3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Link2,
    title: "Paste or Search",
    description: "Enter a product URL or name in the search bar.",
    gradient: "from-primary/10 to-secondary/10",
  },
  {
    icon: BarChart3,
    title: "Compare Prices",
    description: "We scan multiple e-commerce stores and show real-time prices.",
    gradient: "from-secondary/10 to-accent/10",
  },
  {
    icon: ExternalLink,
    title: "Get the Best Deal",
    description: "Click 'View Deal' to go directly to the store with the lowest price.",
    gradient: "from-accent/10 to-primary/10",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative border-t border-border bg-muted/50 py-16 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 animated-gradient opacity-50" />
    <div className="container relative mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center font-display text-2xl font-bold text-foreground"
      >
        How It Works
      </motion.h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="card-3d flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center"
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} glow-primary`}>
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              {step.description}
            </p>
            <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
              {i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
