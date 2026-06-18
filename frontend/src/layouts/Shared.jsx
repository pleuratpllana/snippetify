import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import Header from "../components/shared/Header";
import BottomNav from "../components/shared/BottomNav";
import { useState, useEffect } from "react";
import PageWrapper from "../pages/PageWrapper";

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header title="Dashboard" />

        <main className="flex-1 overflow-auto p-4 sm:p-2 md:p-6 lg:p-10">
          {/* PageWrapper animates on navigation without remounting */}
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
