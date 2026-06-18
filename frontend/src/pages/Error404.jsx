import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../assets/Error404.json"; // adjust path if needed

const Error404 = () => {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[32rem] h-auto mb-6">
        <Lottie
          animationData={errorAnimation}
          loop={true}
          className="w-full h-full"
        />
      </div>

      <h1 className="mb-1">Error 404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/dashboard" className="reactlinkbutton">
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default Error404;
