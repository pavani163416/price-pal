import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Code2, Database, Bot, BarChart3, Shield, Zap, Globe, Lock, RefreshCw, Layers, ArrowRight } from "lucide-react";

const features = [
  { icon: Zap, title: "Smart Comparison", desc: "Paste any product URL and instantly compare prices across Amazon, Flipkart, and Croma." },
  { icon: Shield, title: "Price Alerts", desc: "Set target prices and get real-time notifications when prices drop to your desired level." },
  { icon: Bot, title: "AI Chatbot", desc: "Ask the chatbot to set alerts, search products, or get recommendations using natural language." },
];

const techDetails = [
  {
    icon: Code2,
    title: "Frontend — What the User Sees",
    items: [
      { name: "React 18", why: "Component-based UI library. Each button, card, and page is a reusable building block that snaps together like LEGO.", how: "Uses Virtual DOM diffing — when data changes, React calculates the minimum DOM updates needed, making re-renders blazing fast." },
      { name: "TypeScript 5", why: "Adds static type-checking on top of JavaScript — like spell-check but for code. Catches bugs at compile time before they reach users.", how: "Every function parameter, API response, and state variable has a defined type. The compiler flags mismatches instantly." },
      { name: "Vite 5", why: "Next-generation build tool that serves code via native ES modules during development — instant Hot Module Replacement (HMR).", how: "Uses esbuild for pre-bundling dependencies (10-100× faster than Webpack) and Rollup for optimized production bundles with tree-shaking." },
      { name: "Tailwind CSS 3", why: "Utility-first CSS framework. Instead of writing separate stylesheets, you compose designs with atomic classes like bg-primary and rounded-xl.", how: "Scans your source files at build time using JIT (Just-In-Time) compilation, generating only the CSS classes you actually use — resulting in tiny CSS bundles." },
      { name: "Framer Motion", why: "Declarative animation library for React. Makes elements slide, fade, scale, and bounce with simple props.", how: "Uses spring physics and layout animations under the hood. Animations are GPU-accelerated via CSS transforms for 60fps smoothness." },
    ],
  },
  {
    icon: Database,
    title: "Backend & Database — The Brain Behind the Scenes",
    items: [
      { name: "Supabase (PostgreSQL)", why: "Open-source Firebase alternative providing a full Postgres database, authentication, and real-time subscriptions out of the box.", how: "All data (users, price alerts, profiles) is stored in PostgreSQL tables. Row-Level Security (RLS) policies ensure each user can only access their own data — enforced at the database level, not application code." },
      { name: "Supabase Auth", why: "Handles user registration, login, and session management securely with JWT tokens.", how: "On sign-up, a hashed password is stored. On login, a signed JWT (like a theme-park wristband) is issued. Every API request includes this token, and the backend verifies it before granting access." },
      { name: "Edge Functions (Deno/TypeScript)", why: "Serverless functions that run close to the user (edge locations). They handle product search, AI chat, and scraping orchestration.", how: "When you search for a product, a POST request hits the Edge Function. It extracts the product title, calls the Firecrawl API for each store in parallel, normalizes the results, and returns a unified JSON response — all in one round trip." },
    ],
  },
  {
    icon: Globe,
    title: "Web Scraping — How We Get Prices",
    items: [
      { name: "Firecrawl API", why: "Cloud-based web scraping service that replaces traditional tools like BeautifulSoup or Selenium. It handles JavaScript rendering, anti-bot protections (CAPTCHAs, rate limits), and dynamic content automatically.", how: "The Edge Function sends a search query to Firecrawl's /search endpoint with site-specific parameters (e.g., site:amazon.in). Firecrawl visits the pages in a headless browser, waits for JS to render, extracts structured data (title, price, rating, image, URL), and returns clean JSON. No infrastructure to maintain — it runs entirely in the cloud." },
    ],
  },
  {
    icon: Bot,
    title: "AI — The Smart Chatbot",
    items: [
      { name: "Google Gemini (via AI Gateway)", why: "Large Language Model that powers the chatbot. It understands natural language queries and can execute actions through function-calling (tool use).", how: "The chat Edge Function sends conversation history + a system prompt + tool definitions to Gemini. If the user says 'Set alert for iPhone at ₹60,000 on Amazon', Gemini recognizes the intent, extracts parameters (product, price, store), and calls the set_price_alert tool — which inserts a row into the database. The AI then confirms the action in natural language." },
    ],
  },
  {
    icon: Lock,
    title: "Security — Keeping Data Safe",
    items: [
      { name: "Row-Level Security (RLS)", why: "Database-level access control. Even if someone bypasses the frontend, the database itself refuses unauthorized queries.", how: "Each table has policies like: 'Users can only SELECT/INSERT/DELETE rows WHERE user_id = auth.uid()'. This is checked on every single query — no exceptions." },
      { name: "JWT Authentication", why: "Stateless, tamper-proof tokens that prove identity without server-side sessions.", how: "The token contains the user ID (sub claim), is signed with a secret key, and expires automatically. Edge Functions decode the JWT from the Authorization header to identify the user making the request." },
    ],
  },
  {
    icon: RefreshCw,
    title: "Real-Time Notifications — Price Alert System",
    items: [
      { name: "Polling-Based Notifier", why: "A background React component that checks if any active alerts have been triggered (current_price ≤ target_price).", how: "Every 10 seconds, the PriceAlertNotifier queries the price_alerts table for active alerts where the price condition is met. When found, it fires a toast notification ('🎉 Price dropped!'), marks the alert as inactive, and stops further notifications for that item. A custom event (price-alert-created) also triggers an immediate check when a new alert is saved." },
    ],
  },
];

const flowSteps = [
  { step: "You paste a URL or type a product name", detail: "The frontend captures the input and sends it to the product-search Edge Function via Supabase client SDK." },
  { step: "Edge Function extracts the product title", detail: "If a URL is provided, Firecrawl scrapes the page to extract the product title. If text is provided, it's used directly as the search query." },
  { step: "Firecrawl searches Amazon, Flipkart & Croma simultaneously", detail: "Three parallel API calls are made to Firecrawl's /search endpoint, each scoped to a specific store domain (site:amazon.in, site:flipkart.com, site:croma.com)." },
  { step: "Results are normalized and compared", detail: "Raw scraped data is cleaned — prices are parsed from strings like '₹74,999' to numbers, ratings are extracted, images are resolved, and the lowest price is flagged with is_best_price." },
  { step: "Frontend displays comparison cards", detail: "React components render ProductCards in a responsive grid. Framer Motion animates them in with staggered fade-up transitions. The best deal gets a highlighted badge." },
  { step: "You set a price alert → Database stores it", detail: "The alert (product name, store, current price, target price) is inserted into the price_alerts table with your user_id and is_active = true." },
  { step: "Notifier checks every 10 seconds → Toast pops up! 🎉", detail: "The PriceAlertNotifier component queries for alerts where current_price ≤ target_price, shows a toast notification, and deactivates the alert." },
];

const anim = (delay: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

const About = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <div className="relative container mx-auto flex-1 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />

      <motion.h1 {...anim(0)} className="relative mb-4 font-display text-3xl font-bold text-foreground">
        About <span className="text-gradient">Pricewise.ai</span>
      </motion.h1>

      <motion.p {...anim(0.05)} className="relative mb-10 max-w-2xl text-muted-foreground">
        Pricewise.ai is an AI-powered smart product comparison platform that helps you find the best deals across Amazon, Flipkart, and Croma. Simply paste a product link or search by name, and we'll do the rest.
      </motion.p>

      {/* Key Features */}
      <motion.h2 {...anim(0.1)} className="relative mb-4 font-display text-xl font-semibold text-foreground">
        Key Features
      </motion.h2>
      <div className="relative mb-12 grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <motion.div key={f.title} {...anim(0.15 + i * 0.08)} className="rounded-xl glass-card border border-border/30 p-5 transition-all hover:border-primary/20 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.15)]">
            <f.icon className="mb-3 h-6 w-6 text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
            <h3 className="mb-1 font-display text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Tech Stack */}
      <motion.h2 {...anim(0.3)} className="relative mb-2 font-display text-xl font-semibold text-foreground">
        <Layers className="mr-2 inline h-5 w-5 text-primary" />
        Technology Stack — In Detail
      </motion.h2>
      <motion.p {...anim(0.32)} className="relative mb-6 text-sm text-muted-foreground">
        Every technology we use, why we chose it, and how it works under the hood.
      </motion.p>

      <div className="relative mb-12 space-y-6">
        {techDetails.map((section, si) => (
          <motion.div key={section.title} {...anim(0.35 + si * 0.06)} className="rounded-xl glass-card border border-border/30 p-6">
            <div className="mb-4 flex items-center gap-3">
              <section.icon className="h-6 w-6 text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.3)]" />
              <h3 className="font-display text-base font-bold text-foreground">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.name} className="rounded-lg border border-border/20 bg-muted/30 p-4">
                  <h4 className="mb-1 font-display text-sm font-semibold text-foreground">{item.name}</h4>
                  <p className="mb-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">Why: </span>{item.why}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-secondary">How: </span>{item.how}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Complete Flow */}
      <motion.h2 {...anim(0.7)} className="relative mb-2 font-display text-xl font-semibold text-foreground">
        <BarChart3 className="mr-2 inline h-5 w-5 text-primary" />
        The Complete Flow — Step by Step
      </motion.h2>
      <motion.p {...anim(0.72)} className="relative mb-6 text-sm text-muted-foreground">
        From your search query to a price alert notification — here's exactly what happens.
      </motion.p>

      <motion.div {...anim(0.75)} className="relative mb-12 max-w-3xl space-y-1">
        {flowSteps.map((s, i) => (
          <div key={i} className="rounded-lg glass-card border border-border/30 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 font-display text-xs font-bold text-primary">{i + 1}</span>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{s.step}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
              </div>
            </div>
            {i < flowSteps.length - 1 && (
              <div className="ml-3 mt-1 flex justify-start">
                <ArrowRight className="h-4 w-4 rotate-90 text-primary/40" />
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default About;
