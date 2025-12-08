import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the children
  return children;
};

export default ProtectedRoute;
