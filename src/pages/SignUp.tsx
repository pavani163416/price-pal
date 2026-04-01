import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl float-animation" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl float-animation" style={{ animationDelay: "-3s" }} />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/10 blur-2xl float-animation" style={{ animationDelay: "-1.5s" }} />

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 font-body text-sm font-medium text-muted-foreground shadow-[0_4px_16px_-4px_hsl(var(--border))] backdrop-blur-sm transition-all hover:bg-card hover:text-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_hsl(var(--primary)/0.15)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="PriceWise.ai" className="h-10 w-10 drop-shadow-[0_4px_12px_hsl(var(--primary)/0.3)]" />
            <span className="font-display text-2xl font-bold text-foreground">
              Pricewise<span className="text-gradient">.ai</span>
            </span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Create your account</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.12),0_8px_24px_-8px_hsl(var(--foreground)/0.06)] transition-shadow hover:shadow-[0_24px_70px_-15px_hsl(var(--primary)/0.18),0_12px_30px_-8px_hsl(var(--foreground)/0.08)]"
        >
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-body text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:shadow-[inset_0_2px_4px_hsl(var(--primary)/0.06)]"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-body text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:shadow-[inset_0_2px_4px_hsl(var(--primary)/0.06)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-body text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:shadow-[inset_0_2px_4px_hsl(var(--primary)/0.06)]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_8px_28px_-4px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
          <p className="text-center font-body text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
