import LandingLayout from "../layouts/Landing";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <LandingLayout>
    <h1 className="text-4xl font-bold mb-4">Save Your Code Snippets</h1>
    <p className="mb-6 text-center">Keep all your code in one secure place.</p>
    <Link to="/register" className="button-like w-50">
      Register
    </Link>
  </LandingLayout>
);
export default LandingPage;
