import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Code2, Database, Bot, BarChart3, Shield, Zap } from "lucide-react";

const techStack = [
  { icon: Code2, title: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"] },
  { icon: Database, title: "Backend & Database", items: ["Supabase (PostgreSQL)", "Deno Edge Functions", "Row-Level Security"] },
  { icon: Bot, title: "AI & Scraping", items: ["Google Gemini AI", "Firecrawl API", "Smart Title Extraction"] },
  { icon: BarChart3, title: "Comparison Engine", items: ["Multi-platform search", "Amazon, Flipkart, Croma", "Real-time price tracking"] },
];

const features = [
  { icon: Zap, title: "Smart Comparison", desc: "Paste any product URL and instantly compare prices across Amazon, Flipkart, and Croma." },
  { icon: Shield, title: "Price Alerts", desc: "Set target prices and get real-time notifications when prices drop to your desired level." },
  { icon: Bot, title: "AI Chatbot", desc: "Ask the chatbot to set alerts, search products, or get recommendations using natural language." },
];

const About = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <div className="relative container mx-auto flex-1 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-4 font-display text-3xl font-bold text-foreground">
        About <span className="text-gradient">Pricewise.ai</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative mb-10 max-w-2xl text-muted-foreground">
        Pricewise.ai is an AI-powered smart product comparison platform that helps you find the best deals across multiple e-commerce platforms. Simply paste a product link or search by name, and we'll do the rest.
      </motion.p>

      {/* Features */}
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-4 font-display text-xl font-semibold text-foreground">
        Key Features
      </motion.h2>
      <div className="relative mb-12 grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="rounded-xl glass-card border border-border/30 p-5 transition-all hover:border-primary/20 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.15)]">
            <f.icon className="mb-3 h-6 w-6 text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
            <h3 className="mb-1 font-display text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative mb-4 font-display text-xl font-semibold text-foreground">
        Technology Stack
      </motion.h2>
      <div className="relative mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {techStack.map((t, i) => (
          <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.08 }} className="rounded-xl glass-card border border-border/30 p-5 transition-all hover:border-primary/20">
            <t.icon className="mb-3 h-6 w-6 text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
            <h3 className="mb-2 font-display text-sm font-semibold text-foreground">{t.title}</h3>
            <ul className="space-y-1">
              {t.items.map((item) => (
                <li key={item} className="text-xs text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="relative mb-4 font-display text-xl font-semibold text-foreground">
        How It Works
      </motion.h2>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="relative max-w-2xl rounded-xl glass-card border border-border/30 p-6">
        {["User pastes a product URL or types a product name", "Backend extracts the product title from the URL", "Product is searched across Amazon, Flipkart & Croma via Firecrawl", "Results are compared and displayed with prices, ratings & availability", "User can set price alerts and get notified when prices drop"].map((step, i) => (
          <div key={i} className="flex items-start gap-3 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 font-display text-xs font-bold text-primary">{i + 1}</span>
            <p className="text-sm text-muted-foreground">{step}</p>
          </div>
        ))}
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default About;
