import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import DropdownButton from "./DropdownButton";
import { motion } from "framer-motion";
import { useTheme } from "../../context/themeContext";
import LogoLight from "../../assets/LogoLight.png";
import LogoDark from "../../assets/LogoDark.png";

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { themeDark, setThemeDark } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/profile");
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-[var(--color-lightgray)] flex items-center justify-between px-4 sm:px-2 py-4 sm:py-2 md:px-6 lg:px-8 h-16">
      {/* Left: Theme toggle */}
      <button
        onClick={() => setThemeDark(!themeDark)}
        className="bg-transparent text-[var(--color-text)] p-0"
      >
        <motion.div
          initial={false} // disables animation on mount
          animate={{ rotate: themeDark ? 20 : -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {themeDark ? (
            <MoonIcon className="w-5 h-5" />
          ) : (
            <SunIcon className="w-5 h-5" />
          )}
        </motion.div>
      </button>

      {/* Center: Logo */}
      <img src={themeDark ? LogoDark : LogoLight} alt="Logo" className="h-7" />

      {/* Right: User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="group flex items-center gap-2.5 p-2 rounded-md cursor-pointer transition-colors"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <div className="flex flex-col text-right text-xs hidden sm:flex">
            <span className="font-medium group-hover:text-[var(--color-text)] transition-colors">
              Welcome, {user?.username || "Guest"}
            </span>
          </div>

          <div className="p-1 rounded-full shadow-md inline-flex items-center transition-colors">
            <UserIcon className="w-5 h-5 text-[var(--color-muted)] group-hover:text-[var(--color-darkaccent)]" />
          </div>
        </div>

        <div
          className={`absolute top-full mt-2 right-0 bg-[var(--color-bg)] shadow-md p-2 rounded-md w-32 flex flex-col text-left z-50
            transform transition-all duration-200 ease-out
            ${
              dropdownOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
          <DropdownButton onClick={handleProfile}>
            <UserIcon className="w-4 h-4 inline-block mr-2" />
            Profile
          </DropdownButton>
          <DropdownButton onClick={handleSignOut}>
            <ArrowRightOnRectangleIcon className="w-4 h-4 inline-block mr-2" />
            Logout
          </DropdownButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
