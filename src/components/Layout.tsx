
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useWindowSize from "@/hooks/use-window-size";

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { width } = useWindowSize();

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
    <div className="h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Sidebar is now fixed position with controlled width */}
        <Sidebar isMobile={isMobile} />
        
        <main 
          className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 ml-16"
        >
          <div className="w-full mx-auto animate-fade-in">
            <div className="max-w-full overflow-x-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
