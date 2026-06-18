import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return <div>Authenticating...</div>;
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailConfirmed) {
    return (
      <div className="text-center mt-8 text-[var(--color-text)]">
        Please verify your email before continuing.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
