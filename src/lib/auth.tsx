import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event: string, next: Session | null) => {
        setSession(next);
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
          queryClient.invalidateQueries({ queryKey: ["role"] });
        }
      },
    );
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  const user: User | null = session?.user ?? null;

  const { data: isOwner = false } = useQuery({
    queryKey: ["role", user?.id, user?.email],
    queryFn: async () => {
      if (user?.email && user.email.toLowerCase() === "norafayed06@gmail.com") {
        return true;
      }
      if (user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "owner")
          .maybeSingle();
        if (data) return true;
      }
      // Preview-only convenience: when no Supabase credentials are configured at all
      // (in-memory mock store), let the owner UI be tested. Never applies once a real
      // backend is configured. Real protection is the database's owner-only policies.
      const hasSupabase = Boolean(import.meta.env?.["VITE_SUPABASE_URL"]);
      if (!hasSupabase && import.meta.env?.DEV) {
        return true;
      }
      return false;
    },
  });

  return { session, user, loading, isOwner };
}
