import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, BellOff, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
      <div className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Price Alerts</h1>
            <p className="mt-1 font-body text-muted-foreground">Get notified when prices drop on your favorite products.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Alert
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.product_name}
                  onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="iPhone 15 Pro Max"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Product URL (optional)</label>
                <input
                  type="url"
                  value={form.product_url}
                  onChange={(e) => setForm({ ...form, product_url: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="45000"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Create Alert
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-6 py-2.5 font-display text-sm font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading alerts…</div>
        ) : alerts.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-body text-lg text-muted-foreground">No price alerts yet.</p>
            <p className="text-sm text-muted-foreground">Create one to get notified when prices drop!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-opacity ${
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
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title={alert.is_active ? "Pause alert" : "Resume alert"}
                >
                  {alert.is_active ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Delete alert"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PriceAlerts;
