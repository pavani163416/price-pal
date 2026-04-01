import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center"
      >
        <motion.h1
          className="font-display text-8xl font-black text-gradient md:text-9xl"
          animate={{ textShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.h1>
        <p className="mt-4 text-xl font-medium text-muted-foreground">
          Oops! Page not found
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 btn-press"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
