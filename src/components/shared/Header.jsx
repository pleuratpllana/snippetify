// src/components/shared/Header.jsx
import ThemeToggle from "../ThemeToggle"; // make sure ThemeToggle.jsx is in the same folder

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white dark:bg-gray-800 transition-colors">
      <h1 className="text-lg font-bold">Snippetify</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header;
