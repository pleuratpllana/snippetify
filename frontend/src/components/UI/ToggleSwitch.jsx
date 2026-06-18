const ToggleSwitch = ({ label, enabled, onChange, disabled = false }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span
        className={`text-sm font-medium ${
          disabled ? "text-[var(--color-muted)] " : "[var(--color-lightgray)] "
        }`}
      >
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors  ${
            disabled
              ? "bg-[var(--color-lightgray)] cursor-not-allowed"
              : "bg-[var(--color-lightgray)] peer-checked:bg-[var(--color-text)] peer-focus:ring-2 peer-focus:ring-[var(--color-accent)]"
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 w-5 h-5 bg-[var(--color-bg)] rounded-full shadow transform transition-transform ${
            enabled ? "translate-x-full" : "translate-x-0"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        ></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
