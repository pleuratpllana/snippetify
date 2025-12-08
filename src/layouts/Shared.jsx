// src/layouts/AppLayout.jsx
import Header from "../components/Shared/Header";

const AppLayout = ({ children }) => (
  <div className="min-h-screen flex bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
    {/* Optional Sidebar can go here */}
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  </div>
);

export default AppLayout;
