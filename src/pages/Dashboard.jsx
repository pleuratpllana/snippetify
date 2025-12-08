import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import PageWrapper from "./PageWrapper";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center text-center h-screen">
        <h1 className="mb-12">Welcome to your dashboard</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
