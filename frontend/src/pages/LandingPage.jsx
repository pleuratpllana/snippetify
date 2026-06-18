import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/outline";
import {
  Save,
  WandSparkles,
  MousePointerClick,
  SearchCode,
  Folders,
  ToggleLeft,
  TabletSmartphone,
  Braces,
  Mail,
  Linkedin,
  Github,
  PanelsTopLeft,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

import LandingLayout from "../layouts/Landing";
import useTypingEffect from "../hooks/useTypingEffect";
import scrollToSection from "../hooks/scrollToSection";

import Logo from "../assets/LogoLight.png";
import UntitledImage from "../assets/Untitled-1.jpg";
import {
  LightnDarkGif,
  SmartSearchGif,
  NewMobileViewGif,
  DragnDrop,
  Organize,
  AddSnippet,
  AskAI,
} from "../hooks/GifImporter";

import PageWrapper from "./PageWrapper";
import Container from "../components/shared/Container";
import BorderedHeading from "../components/BorderedHeading";

import Accordions from "../components/UI/Accordions";

// Reusable NavLink
const NavLink = ({ href, label, onClick }) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      scrollToSection(href.replace("#", ""));
      onClick?.();
    }}
    className="text-[var(--text-color)] hover:text-[var(--color-darkaccent)] no-underline transition-colors duration-200"
  >
    {label}
  </a>
);

// Header Navigation
const HeaderNav = ({ menuOpen, closeMenu }) => {
  const links = [
    { href: "#solution", label: "Solution" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#faqs", label: "FAQs" },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center gap-10 text-[var(--color-muted)] mr-auto ml-8">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            onClick={closeMenu}
          />
        ))}
      </nav>

      <div
        className={`absolute top-full left-0 w-full bg-white border border-[var(--color-border)] border-t-0 rounded-b-xl shadow-lg md:hidden transition-all duration-500 ease-out ${
          menuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        style={{ transitionProperty: "max-height, opacity, transform" }}
      >
        <div className="py-2 px-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-[var(--color-text)] no-underline border-b border-gray-100"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-3 py-4">
            <Link
              to="/login"
              className="flex items-center gap-2 text-[var(--color-text)] no-underline hover:text-[var(--color-darkaccent)] transition-colors"
              onClick={closeMenu}
            >
              <UserIcon className="w-5 h-5 text-current" />
              Login
            </Link>
            <Link
              to="/register"
              className="reactlinkbutton px-4 py-2 text-sm whitespace-nowrap"
              onClick={closeMenu}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// Header
const Header = ({ scrolled, menuOpen, toggleMenu, closeMenu }) => (
  <header
    className={`fixed max-w-7xl mx-auto top-5 left-4 right-4 sm:left-4 sm:right-4 z-50 border border-[var(--color-border)] rounded-xl transition-all duration-300 ${
      scrolled ? "backdrop-blur-md bg-white/70" : "bg-white"
    }`}
  >
    <div className="relative flex items-center justify-between px-4 py-4 text-base ">
      <div className="flex justify-center items-center space-x-2">
        <img src={Logo} className="w-9" alt="Logo" />
        <a
          href="#top"
          className="font-bold text-[var(--color-text)] whitespace-nowrap no-underline md:hidden lg:block"
        >
          Snippetify
        </a>
      </div>

      <HeaderNav menuOpen={menuOpen} closeMenu={closeMenu} />

      <div className="flex space-x-4 justify-center items-center">
        <Link
          to="/login"
          className="hidden md:flex items-center gap-1 bg-transparent custom-button no-underline hover:text-[var(--color-darkaccent)] usericon text-sm"
        >
          <UserIcon className="w-5 h-5 text-current" />
          Login
        </Link>
        <Link
          to="/register"
          className="reactlinkbutton px-8 py-2.5 hidden md:inline-flex transition-all duration-200"
        >
          Register
        </Link>
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-50 focus:outline-none bg-transparent group"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span
          className={`absolute block h-0.5 bg-black transition-all duration-300 ease-out ${
            menuOpen
              ? "rotate-45 translate-y-0 w-6 bg-[var(--color-accent)]"
              : "-translate-y-2 w-5 group-hover:w-6"
          }`}
        />
        <span
          className={`absolute block h-0.5 bg-black transition-all duration-200 ease-out ${
            menuOpen
              ? "opacity-0 translate-x-4"
              : "opacity-100 w-6 group-hover:bg-[var(--color-accent)]"
          }`}
        />
        <span
          className={`absolute block h-0.5 bg-black transition-all duration-300 ease-out ${
            menuOpen
              ? "-rotate-45 translate-y-0 w-6 bg-[var(--color-accent)]"
              : "translate-y-2 w-5 group-hover:w-6"
          }`}
        />
      </button>
    </div>
  </header>
);

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Hero
const HeroSection = ({ text, longestWordLength }) => (
  <main id="top" className="mt-6 scroll-smooth">
    <Container textAlign="center">
      <h1 className="text-[var(--text-color)] mt-40">
        A vault made to{" "}
        <span className="inline-flex relative h-[1.2em]">
          <span
            className={`block text-[var(--color-accent)] min-w-[${longestWordLength}ch]`}
          >
            {text}
          </span>
          <span className="w-[0.5rem] ml-3 bg-[var(--color-accent)] animate-blink" />
        </span>
        <br />
        your code snippets.
      </h1>

      <p className="max-w-2xl mt-8 mx-auto mb-6">
        Save, organize, and share code in seconds. The ultimate code management
        tool for developers, students, and professionals.
      </p>

      <Link
        to="/register"
        className="reactlinkbutton px-8 py-3 transition-all duration-200 hover:scale-105"
      >
        Try for Free
      </Link>

      <div className="mt-14 mx-auto w-full  max-w-7xl mx-auto shadow-lg rounded-2xl">
        <PageWrapper className="block">
          <motion.img
            src={UntitledImage}
            alt="Illustration"
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl border border-[var(--color-border)]"
          />
        </PageWrapper>
      </div>
    </Container>
  </main>
);
// Feature data
const featureList = [
  {
    title: "Organize",
    description:
      "Mark favorites, organize in folders, and filter by language for perfect organization.",
    colSpan: 3,
    rowSpan: 12,
    image: Organize,
    icon: Folders,
  },
  {
    title: "Add/Edit",
    description:
      "Quickly add, edit and save code snippets with syntax highlighting for up to 50 languages and much more than that.",
    colSpan: 2,
    rowSpan: 9,
    image: AddSnippet,
    icon: Save,
  },

  {
    title: "Smart Search",
    description:
      "Find any snippet instantly with powerful search across titles, tags, and code content.",
    colSpan: 2,
    rowSpan: 7,
    icon: SearchCode,
    image: SmartSearchGif,
  },
  {
    title: "Drag & Drop",
    description:
      "Flexible layout options: In addition to switching easily between list and grid views, you can arrange the cards using a drag-and-drop feature, giving you complete control over your workspace. This seamless arrangement ensures your workflow stays organized, efficient, and completely hassle-free, coding and managing your snippets effortlessly.",
    colSpan: 3,
    rowSpan: 4,
    icon: MousePointerClick,
    image: DragnDrop,
  },
  {
    title: "Ask AI",
    description:
      "Ask AI to write code snippets for you. They can be automatically saved to any of your folders.",
    colSpan: 3,
    rowSpan: 4,
    icon: WandSparkles,
    image: AskAI,
  },
  {
    title: "Mobile Friendly",
    description:
      "Adapt your layout to a light or dark theme, depending on your preference or visual accessibility needs.",
    colSpan: 2,
    rowSpan: 6,
    icon: TabletSmartphone,
    image: NewMobileViewGif,
  },
  {
    title: "Export",
    description: "Export snippets as a JSON file.",
    colSpan: 1,
    rowSpan: 1,
    icon: Braces,
  },

  {
    title: "Light & Dark Mode",
    description:
      "A sticky bottom navigation for mobile screens, enabling seamless navigation like a native app.",
    colSpan: 2,
    rowSpan: 2,
    icon: ToggleLeft,
    image: LightnDarkGif,
  },
  {
    title: "Flexible",
    description: "Grid View. List View. Sidebar.",
    colSpan: 1,
    rowSpan: 1,
    icon: PanelsTopLeft,
  },
];

// Landing Page
const LandingPage = () => {
  const words = ["save", "organize", "generate"];
  const { text } = useTypingEffect(words, 120, 1000);
  const longestWordLength = Math.max(...words.map((w) => w.length));

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest("header")) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <LandingLayout>
      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />

      <HeroSection text={text} longestWordLength={longestWordLength} />

      <Container id="solution" textAlign="left">
        <BorderedHeading text="Solution" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="mt-3 max-w-lg">The story behind Snippetify</h2>
            <p className="mt-10 text-[var(--color-muted)]">
              Ever spent more time hunting for a code snippet than actually
              writing code or boilerplate? Messy folders, old projects,
              countless bookmarks. it happens to every developer.
            </p>
            <p className="mt-6 text-[var(--color-muted)]">
              That frustration is what led me to build Snippetify. I didn’t want
              another snippet manager - I just wanted my own tool after all
              these years. Fast, simple, and personal, built the way I think and
              organize code, with everything in one place so I never have to
              leave the tool. Sure, there are plenty of tools out there, but I
              wanted mine.
            </p>
          </div>

          <div className="bg-[var(--color-superlightbg)] rounded-2xl h-full min-h-[200px] w-full"></div>
        </div>
      </Container>

      <Container id="features" textAlign="center">
        <BorderedHeading text="Features" />
        <h2 className="mt-3 mb-8">Simplicity in features</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-auto w-full mt-10">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="
    relative bg-[var(--color-superlightbg)] pt-10 px-10 pb-0 rounded-xl flex flex-col items-start
    lg:[grid-column:span_var(--col-span)] lg:[grid-row:span_var(--row-span)]
    before:absolute before:top-0 before:left-0 before:w-full before:h-[1px]
    before:bg-gradient-to-r before:from-transparent before:via-[var(--color-border)] before:to-transparent
    after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px]
    after:bg-gradient-to-r after:from-transparent after:via-[var(--color-border)] after:to-transparent
  "
                style={{
                  "--col-span": feature.colSpan,
                  "--row-span": feature.rowSpan,
                }}
              >
                {Icon && <Icon className="w-6 h-6" />}
                <h4 className="mb-3 mt-3">{feature.title}</h4>
                <p className="text-[var(--color-muted)] mb-10 text-left">
                  {feature.description}
                </p>
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="mt-auto w-full  rounded-t-2xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>

      <Container id="how-it-works">
        <BorderedHeading text="How it Works?" />
        <h2 className="mt-3">As Simple as 1, 2, 3</h2>
      </Container>

      <Container id="faqs">
        <BorderedHeading text="FAQs" />
        <h2 className="mt-3">From the FAQs</h2>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8"
        >
          <Accordions />
        </motion.div>
      </Container>

      {/* Footer outside Container */}
      <footer className="my-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-center gap-4">
        {/* Left: Follow me */}
        <div className="flex items-center gap-2 justify-center text-sm">
          <p className="mb-0 text-sm">Get in Touch: </p>

          <a
            href="https://www.linkedin.com/in/pleuratpllana"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/pleuratpllana"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.pleuratpllana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>

        {/* Center: Copyright */}
        <div className="flex flex-col items-center text-center space-y-2">
          <img src={Logo} className="w-9" alt="Logo" />
          <a
            href="#top"
            className="font-bold text-[var(--color-text)] whitespace-nowrap no-underline"
          >
            Snippetify
          </a>
          <p className="text-sm">© 2025 Snippetify. All rights reserved.</p>
        </div>

        {/* Right: Email */}
        <a
          href="mailto:info@pleuratpllana.com"
          className="flex items-center gap-1 hover:text-[var(--color-accent)] no-underline "
        >
          <Mail className="w-5 h-5" />
          <p className="mb-0 text-sm">info@pleuratpllana.com</p>
        </a>
      </footer>
    </LandingLayout>
  );
};

export default LandingPage;
