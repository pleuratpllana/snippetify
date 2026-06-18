import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageWrapper = ({ children, className }) => {
  const controls = useAnimation();
  const location = useLocation();

  useEffect(() => {
    // Trigger a subtle fade/slide on navigation
    controls.start({
      opacity: [0, 1],
      y: [10, 0],
      transition: { duration: 0.2, ease: "easeOut" },
    });
  }, [location.pathname, controls]);

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0, y: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
