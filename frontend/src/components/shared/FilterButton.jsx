import { motion } from "framer-motion";

const FilterButton = ({
  icon: Icon,
  label,
  count,
  onClick,
  active,
  disabled = false,
  centered = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`custom-button flex items-center justify-between w-full mb-2 text-xs font-semibold rounded-md px-3 py-2
        transition-colors duration-200
        ${active ? "bg-[var(--color-superlightaccent)]" : ""}
        ${
          !disabled && !active ? "hover:bg-[var(--color-superlightaccent)]" : ""
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <motion.span
          className="whitespace-nowrap overflow-hidden"
          animate={{
            opacity: centered ? 0 : 1,
            width: centered ? 0 : "auto",
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </div>

      {count !== undefined && (
        <motion.span
          className="whitespace-nowrap overflow-hidden"
          animate={{
            opacity: centered ? 0 : 1,
            width: centered ? 0 : "auto",
          }}
          transition={{ duration: 0.2 }}
        >
          {count}
        </motion.span>
      )}
    </button>
  );
};

export default FilterButton;
