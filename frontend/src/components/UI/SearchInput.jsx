import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Type to search snippet...",
}) => (
  <div className="flex flex-col">
    <label className="text-sm mb-2">Search:</label>
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-3 pr-10 py-2 w-full border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[color:var(--color-accent)] transition-all duration-200"
      />
      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
      </span>
    </div>
  </div>
);

export default SearchInput;
