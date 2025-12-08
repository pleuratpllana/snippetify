import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    console.log("AuthCallback mounted, checking URL for OAuth response...");

    const query = new URLSearchParams(window.location.search);
    const jwt = query.get("jwt");
    let user = null;

    try {
      const userParam = query.get("user");
      if (userParam) user = JSON.parse(userParam);
    } catch (err) {
      console.error("Failed to parse user JSON:", err);
    }

    if (!jwt || !user) {
      console.error("OAuth callback missing JWT or user info");
      console.log("URL search params:", window.location.search);
      navigate("/login"); // fallback
      return;
    }

    // Login user and redirect to dashboard
    login(jwt, user, true);
    navigate("/dashboard");
  }, [login, navigate]);

  return (
    <div className="text-center mt-8">
      <p>Signing you in…</p>
      <p>Check console for debug info</p>
    </div>
  );
}
