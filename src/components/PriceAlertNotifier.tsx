import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Background component that checks price alerts every 10 seconds.
 * Shows a toast notification when current_price <= target_price.
 * Also listens for "price-alert-created" events to check immediately.
 */
const PriceAlertNotifier = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const notifiedRef = useRef<Set<string>>(new Set());

  const checkAlerts = useCallback(async () => {
    if (!user) return;

    const { data: alerts } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("is_active", true);

    if (!alerts) return;

    for (const alert of alerts) {
      if (
        alert.current_price <= alert.target_price &&
        !notifiedRef.current.has(alert.id)
      ) {
        notifiedRef.current.add(alert.id);
        toast({
          title: "🎉 Price Alert Triggered!",
          description: `${alert.product_name} on ${alert.store} is now ₹${alert.current_price.toLocaleString("en-IN")} — at or below your target of ₹${alert.target_price.toLocaleString("en-IN")}!`,
          duration: 10000,
        });
      }
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) return;

    checkAlerts();
    const interval = setInterval(checkAlerts, 10000);

    const handleNewAlert = () => {
      // Small delay to let DB write complete
      setTimeout(checkAlerts, 1500);
    };
    window.addEventListener("price-alert-created", handleNewAlert);

    return () => {
      clearInterval(interval);
      window.removeEventListener("price-alert-created", handleNewAlert);
    };
  }, [user, checkAlerts]);

  return null;
};

export default PriceAlertNotifier;
