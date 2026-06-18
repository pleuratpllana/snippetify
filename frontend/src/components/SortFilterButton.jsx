const SortFilteredButton = ({ options, active, onSelect }) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      <span className="text-sm mt-0 mb-0">Sort by:</span>

      <div className="flex bg-[var(--color-bg) border border-[var(--color-border)] rounded-md p-1.5 gap-1">
        {options.map((option) => {
          const isActive = active === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(isActive ? null : option)}
              className={`
                px-3 py-1 text-xs font-medium transition-colors
                rounded-lg
                ${
                  isActive
                    ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                    : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-lightaccent)]"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortFilteredButton;
