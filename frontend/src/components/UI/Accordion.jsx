import { motion } from "framer-motion";

const Accordion = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border border-[var(--color-border)] rounded-2xl mb-2">
      <button
        className={`group w-full text-left py-4 px-6 flex justify-between items-center focus:outline-none text-lg font-medium
 transition-colors duration-200
          ${
            isOpen
              ? "bg-[var(--color-superlightbg)]"
              : "bg-transparent hover:text-[var(--color-accent)]"
          }`}
        onClick={onClick}
      >
        <span>{title}</span>

        {/* Plus / X icon */}
        <span className="relative w-4 h-4 flex-shrink-0">
          {/* Horizontal bar */}
          <span
            className={`absolute block h-[2px] w-full bg-black transition-all duration-300 ease-in-out
              ${
                isOpen
                  ? "rotate-45 top-1.5 bg-[var(--color-accent)]"
                  : "rotate-0 top-1.5 group-hover:bg-[var(--color-accent)]"
              }`}
          />
          {/* Vertical bar */}
          <span
            className={`absolute block h-[2px] w-full bg-black transition-all duration-300 ease-in-out
              ${
                isOpen
                  ? "-rotate-45 top-1.5 bg-[var(--color-accent)]"
                  : "rotate-90 top-1.5 group-hover:bg-[var(--color-accent)]"
              }`}
          />
        </span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-6 text-[var(--color-muted)] text-base"
      >
        <div className="py-5">{content}</div>
      </motion.div>
    </div>
  );
};

export default Accordion;
