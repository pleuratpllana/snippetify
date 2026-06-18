import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CodeBracketIcon,
  StarIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useSnippets } from "../../context/SnippetContext";

const NAV_BUTTONS = [
  {
    label: "Home",
    icon: HomeIcon,
    filter: null,
    path: "/dashboard",
    position: "left",
  },
  {
    label: "All ",
    icon: CodeBracketIcon,
    filter: "snippets",
    path: "/dashboard",
    position: "left",
  },
  { label: "Add", icon: PlusIcon, position: "center", special: true },
  {
    label: "Favs",
    icon: StarIcon,
    filter: "favorites",
    path: "/dashboard",
    position: "right",
  },
  { label: "Profile", icon: UserIcon, path: "/profile", position: "right" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeFilter, setActiveFilter } = useSnippets();

  const handleClick = (btn) => {
    if (btn.special) {
      navigate("/snippet/new");
      return;
    }

    if (btn.filter !== undefined) setActiveFilter(btn.filter);

    // Handle favorites with query like sidebar
    if (btn.filter === "favorites") {
      navigate("/dashboard?filter=favorites");
    } else if (btn.filter === "snippets") {
      navigate("/dashboard");
    } else {
      navigate(btn.path);
    }
  };

  const renderButton = (btn) => {
    const Icon = btn.icon;
    if (btn.special) {
      return (
        <button
          key={btn.label}
          className="flex flex-col items-center justify-center  w-14 h-14 rounded-full -mt-14 shadow-lg transition-transform duration-200 text-sm"
          onClick={() => handleClick(btn)}
        >
          <Icon className="w-7 h-7" />
        </button>
      );
    }

    const isActive =
      btn.label === "Profile"
        ? location.pathname === btn.path
        : location.pathname === btn.path && activeFilter === btn.filter;

    return (
      <button
        key={btn.label}
        className={`custom-button text-xs font-medium flex flex-col items-center justify-center transition-colors duration-200 hover:text-[var(--color-darkaccent)] ${
          isActive ? "text-[var(--color-darkaccent)]" : ""
        }`}
        onClick={() => handleClick(btn)}
      >
        <Icon className="w-5 h-5 mb-1" />
        <span>{btn.label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed  bottom-0 left-0 w-full h-18 flex justify-between items-center px-2 bg-[var(--color-bg)] shadow-[0_-2px_6px_rgba(0,0,0,0.05)] z-50 text-sm lg:hidden">
      <div className="flex gap-6">
        {NAV_BUTTONS.filter((b) => b.position === "left").map(renderButton)}
      </div>
      <div>
        {NAV_BUTTONS.filter((b) => b.position === "center").map(renderButton)}
      </div>
      <div className="flex gap-6">
        {NAV_BUTTONS.filter((b) => b.position === "right").map(renderButton)}
      </div>
    </nav>
  );
};

export default BottomNav;
