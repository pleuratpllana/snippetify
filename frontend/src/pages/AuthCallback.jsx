import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const routeFromSession = (session) => {
      if (!active) return;
      const user = session?.user;
      if (!session || !user) {
        navigate("/login", { replace: true });
        return;
      }

      navigate(user.email_confirmed_at ? "/dashboard" : "/login", {
        replace: true,
      });
    };

    supabase.auth.getSession().then(({ data }) => {
      routeFromSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      routeFromSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="text-center mt-8">
      <p>Signing you in...</p>
    </div>
  );
}
