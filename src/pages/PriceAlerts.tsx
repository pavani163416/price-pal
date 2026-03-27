import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, BellOff, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PriceAlert {
  id: string;
  product_name: string;
  product_url: string | null;
  product_image: string | null;
  store: string;
  current_price: number;
  target_price: number;
  is_active: boolean;
  created_at: string;
}

const PriceAlerts = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    product_url: "",
    store: "Amazon",
    current_price: "",
    target_price: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("price_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    setAlerts((data as PriceAlert[]) || []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      product_name: form.product_name,
      product_url: form.product_url || null,
      store: form.store,
      current_price: parseFloat(form.current_price),
      target_price: parseFloat(form.target_price),
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Alert created!", description: "You'll be notified when the price drops." });
      setForm({ product_name: "", product_url: "", store: "Amazon", current_price: "", target_price: "" });
      setShowForm(false);
      fetchAlerts();
    }
  };

  const toggleAlert = async (id: string, isActive: boolean) => {
    await supabase.from("price_alerts").update({ is_active: !isActive } as any).eq("id", id);
    fetchAlerts();
  };

  const deleteAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    fetchAlerts();
  };

  const formatPrice = (p: number) => "₹" + p.toLocaleString("en-IN");

  if (authLoading) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="relative container mx-auto flex-1 px-4 py-12">
        <div className="pointer-events-none absolute inset-0 animated-gradient opacity-30 rounded-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Price Alerts</h1>
            <p className="mt-1 font-body text-muted-foreground">Get notified when prices drop on your favorite products.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_8px_28px_-4px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            New Alert
          </button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              className="relative mb-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.1)] overflow-hidden"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Product Name</label>
                  <input
                    type="text"
                    required
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Product URL (optional)</label>
                  <input
                    type="url"
                    value={form.product_url}
                    onChange={(e) => setForm({ ...form, product_url: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://amazon.in/..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Store</label>
                  <select
                    value={form.store}
                    onChange={(e) => setForm({ ...form, store: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Amazon</option>
                    <option>Flipkart</option>
                    <option>Croma</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Current Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.current_price}
                    onChange={(e) => setForm({ ...form, current_price: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="49999"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Alert when price drops to (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.target_price}
                    onChange={(e) => setForm({ ...form, target_price: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.04)] focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="45000"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-border px-6 py-2.5 font-display text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading alerts…</div>
        ) : alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted glow-primary">
              <Bell className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-body text-lg text-muted-foreground">No price alerts yet.</p>
            <p className="text-sm text-muted-foreground">Create one to get notified when prices drop!</p>
          </motion.div>
        ) : (
          <div className="relative space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.1)] ${
                  !alert.is_active ? "border-border opacity-60" : "border-primary/20"
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground">{alert.product_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {alert.store} · Current: {formatPrice(alert.current_price)} · Target:{" "}
                    <span className="font-semibold text-primary">{formatPrice(alert.target_price)}</span>
                  </p>
                </div>
                <button
                  onClick={() => toggleAlert(alert.id, alert.is_active)}
                  className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:shadow-sm"
                  title={alert.is_active ? "Pause alert" : "Resume alert"}
                >
                  {alert.is_active ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:shadow-sm"
                  title="Delete alert"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PriceAlerts;
