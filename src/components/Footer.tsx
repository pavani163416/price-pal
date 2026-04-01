import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

const Footer = () => (
  <footer id="about" className="relative border-t border-border/30 bg-background py-12 overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />
    <div className="absolute top-0 left-0 right-0 neon-line" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container relative mx-auto flex flex-col items-center gap-4 px-4 text-center"
    >
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Pricewise.ai" className="h-7 w-7 drop-shadow-[0_0_10px_hsl(var(--primary)/0.4)]" />
        <span className="font-display text-lg font-bold text-foreground">
          Pricewise<span className="text-gradient">.ai</span>
        </span>
      </div>
      <p className="max-w-md font-body text-sm text-muted-foreground">
        A smart price comparison platform that helps you find the best deals
        across multiple e-commerce stores. Built by the Department of AI & Data Science.
      </p>
      <p className="font-body text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Pricewise.ai — All rights reserved.
      </p>
    </motion.div>
  </footer>
);

export default Footer;
