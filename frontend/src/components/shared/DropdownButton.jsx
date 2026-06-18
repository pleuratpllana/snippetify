const DropdownButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-full custom-button text-sm font-medium text-left  transition-colors duration-200"
    >
      {children}
    </button>
  );
};

export default DropdownButton;
