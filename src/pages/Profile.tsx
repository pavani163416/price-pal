import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string; email: string; created_at: string } | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
        if (data) setProfile(data as any);
      });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="relative container mx-auto flex-1 px-4 py-12">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 font-display text-3xl font-bold text-foreground"
        >
          My <span className="text-gradient">Profile</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-lg rounded-2xl glass-card p-8 shadow-[0_0_50px_-15px_hsl(var(--primary)/0.15)] transition-all hover:shadow-[0_0_60px_-15px_hsl(var(--primary)/0.2)]"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 pulse-glow">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-4">
            {[
              { icon: User, label: "Full Name", value: profile?.full_name || "Not set" },
              { icon: Mail, label: "Email", value: profile?.email || user?.email },
              { icon: Calendar, label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl bg-muted/20 border border-border/30 p-3.5 transition-all hover:bg-muted/40 hover:border-primary/20"
              >
                <item.icon className="h-4 w-4 text-primary drop-shadow-[0_0_4px_hsl(var(--primary)/0.3)]" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
