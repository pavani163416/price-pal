import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Background component that checks price alerts every 60 seconds.
 * Shows a toast notification when current_price <= target_price.
 */
const PriceAlertNotifier = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    const checkAlerts = async () => {
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
    };

    // Check immediately and then every 10 seconds
    checkAlerts();
    const interval = setInterval(checkAlerts, 10000);
    return () => clearInterval(interval);
  }, [user, toast]);

  return null;
};

export default PriceAlertNotifier;
