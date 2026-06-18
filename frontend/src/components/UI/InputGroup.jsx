import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const passwordRules = [
  { id: "length", label: "Minimum 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "Number", test: (p) => /[0-9]/.test(p) },
  {
    id: "symbol",
    label: "Special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

const InputGroup = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  className = "",
  rows = 4,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const isPassword = type === "password";
  const isTextarea = type === "textarea";

  // Update strength based on value
  useEffect(() => {
    if (isPassword && value) {
      const passed = passwordRules.filter((r) => r.test(value)).length;
      setStrength(passed / passwordRules.length);
    } else {
      setStrength(0);
    }
  }, [value, isPassword]);

  const getStrengthColor = () => {
    if (strength <= 0.25) return "bg-red-500";
    if (strength <= 0.75) return "bg-yellow-400";
    return "bg-green-500";
  };

  const baseClasses =
    "w-full p-2 sm:p-3 border border-[var(--color-border)] rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-lightaccent)] transition-colors";

  return (
    <div
      className={`input-group w-full text relative flex flex-col gap-1 ${className}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="font-semibold text-[var(--color-text)] text-sm sm:text-base"
        >
          {label}
        </label>
      )}

      {isTextarea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${baseClasses} resize-none`}
          {...rest}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={isPassword && visible ? "text" : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${baseClasses} pr-10`}
            {...rest}
          />

          {isPassword && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5 text-gray-500"
              onClick={() => setVisible(!visible)}
              whileTap={{ scale: 0.9 }}
              initial={{ rotate: 0 }}
              animate={{ rotate: visible ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {visible ? <EyeIcon /> : <EyeSlashIcon />}
            </motion.div>
          )}
        </div>
      )}

      {/* Password Strength */}
      {isPassword && value && (
        <>
          <div className="w-full h-2 rounded bg-gray-200 overflow-hidden mt-1">
            <motion.div
              className={`h-full ${getStrengthColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${strength * 100}%` }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>

          <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
            {passwordRules.map((rule) => {
              const passed = rule.test(value);
              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-1 ${
                    passed ? "text-green-500" : ""
                  }`}
                >
                  <span>{passed ? "✔" : "•"}</span> {rule.label}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputGroup;
