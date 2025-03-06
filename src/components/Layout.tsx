
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-blue-700">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <main 
          className={`flex-1 overflow-auto p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg
            ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}
        >
          <div className="max-w-6xl mx-auto animate-fade-in rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
