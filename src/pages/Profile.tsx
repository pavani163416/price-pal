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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="relative container mx-auto flex-1 px-4 py-12">
        <div className="pointer-events-none absolute inset-0 animated-gradient opacity-30 rounded-3xl" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 font-display text-3xl font-bold text-foreground"
        >
          My Profile
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-lg rounded-2xl border border-border bg-card p-8 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.12),0_8px_24px_-8px_hsl(var(--foreground)/0.06)] transition-shadow hover:shadow-[0_24px_70px_-15px_hsl(var(--primary)/0.18)]"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 glow-primary">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{profile?.full_name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{profile?.email || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium text-foreground">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
