
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar is now fixed position with controlled width */}
        <Sidebar isMobile={isMobile} />
        
        <main 
          className={cn(
            "flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 ml-16",
            isScrolled && "bg-white/80 backdrop-blur-sm"
          )}
        >
          <div className="w-full mx-auto">
            <div className="max-w-full overflow-x-hidden animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
