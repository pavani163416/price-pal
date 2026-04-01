import { motion } from "framer-motion";

const techs = [
  { name: "React", icon: "⚛️", color: "from-[hsl(197,71%,53%)] to-[hsl(197,71%,40%)]" },
  { name: "TypeScript", icon: "🔷", color: "from-[hsl(211,60%,48%)] to-[hsl(211,60%,35%)]" },
  { name: "Tailwind CSS", icon: "🎨", color: "from-[hsl(198,93%,60%)] to-[hsl(198,93%,45%)]" },
  { name: "Vite", icon: "⚡", color: "from-[hsl(270,76%,53%)] to-[hsl(270,76%,40%)]" },
  { name: "Supabase", icon: "🟢", color: "from-[hsl(153,60%,53%)] to-[hsl(153,60%,38%)]" },
  { name: "Framer Motion", icon: "🎬", color: "from-[hsl(340,82%,52%)] to-[hsl(340,82%,38%)]" },
];

const TechStack = () => (
  <section className="relative overflow-hidden border-t border-border bg-card py-16">
    <div className="pointer-events-none absolute inset-0 animated-gradient opacity-40" />

    {/* Floating 3D orbs */}
    <div className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-secondary/8 blur-3xl float-animation" />
    <div className="pointer-events-none absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-primary/8 blur-3xl float-animation" style={{ animationDelay: "-2s" }} />

    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="mx-auto mb-3 inline-block rounded-full border border-secondary/20 bg-secondary/5 px-4 py-1 font-body text-xs font-medium text-secondary">
          Built With Modern Tech
        </span>
        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Technology <span className="text-gradient">Stack</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg font-body text-sm text-muted-foreground">
          Powered by cutting-edge technologies for blazing-fast performance and seamless experience.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {techs.map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -8, rotateX: 5, scale: 1.05 }}
            className="card-3d flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-[0_8px_30px_-8px_hsl(var(--foreground)/0.06)]"
            style={{ perspective: "800px" }}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${tech.color} text-2xl shadow-[0_8px_20px_-6px_hsl(var(--foreground)/0.15)]`}
            >
              {tech.icon}
            </div>
            <span className="font-display text-sm font-semibold text-foreground">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStack;
