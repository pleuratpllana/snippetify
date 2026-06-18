import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const CustomDropdown = ({
  id,
  options,
  value,
  onChange,
  placeholder = "Select",
  label = "",
  className = "",
  valueClassName = "",
  includeAllOption = false, // new prop to add "All"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Prepend "All" if includeAllOption is true
  const finalOptions =
    includeAllOption && options[0] !== "All" ? ["All", ...options] : options;

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-[var(--color-text)] mb-2"
        >
          {label}:
        </label>
      )}

      <button
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={id}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 flex justify-between items-center hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition text-sm font-normal"
      >
        <span
          className={`${
            !value ? "text-[var(--color-text)]" : "text-[var(--color-text)]"
          } font-normal ${valueClassName}`}
        >
          {value || placeholder}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4 text-[var(--color-text)]" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-[var(--color-text)]" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute z-10 min-w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md mt-1 list-none pl-0 max-h-60 overflow-auto">
          {finalOptions.length > 0 ? (
            finalOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-[var(--color-lightgray)] font-normal"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-400 text-center select-none">
              No data found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
