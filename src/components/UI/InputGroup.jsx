import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const InputGroup = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="input-group w-full relative">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={isPassword && visible ? "text" : type}
        placeholder={placeholder}
        className="input-default pr-10"
        {...rest}
      />
      {isPassword && (
        <motion.div
          className="absolute right-3 top-11 cursor-pointer w-5 h-5 text-gray-500"
          onClick={() => setVisible(!visible)}
          whileTap={{ scale: 0.9 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: visible ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </motion.div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputGroup;
