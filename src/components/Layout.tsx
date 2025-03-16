
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import GlobalDateRangeFilter from "./GlobalDateRangeFilter";

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check for scrolling to add shadow to header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Initial check
    checkScreenSize();
    handleScroll();

    // Add event listeners
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-700">
      <Header
        isMobile={isMobile}
      />
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Sidebar is now fixed position with controlled width */}
        <Sidebar isMobile={isMobile} />
        
        <main 
          className="flex-1 overflow-auto p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg ml-16"
        >
          <div className="mb-4">
            <GlobalDateRangeFilter />
          </div>
          <div className="max-w-6xl mx-auto animate-fade-in rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
