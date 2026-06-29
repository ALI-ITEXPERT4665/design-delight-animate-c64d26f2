import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SessionState = {
  loading: boolean;
  userId: string | null;
  email: string | null;
};

export function useSession(): SessionState {
  const [s, setS] = useState<SessionState>({ loading: true, userId: null, email: null });
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setS({
        loading: false,
        userId: data.session?.user.id ?? null,
        email: data.session?.user.email ?? null,
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setS({
        loading: false,
        userId: session?.user.id ?? null,
        email: session?.user.email ?? null,
      });
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);
  return s;
}
