
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CalendarSidebar from "./calendar/CalendarSidebar";
import LeftCalendarSidebar from "./calendar/LeftCalendarSidebar";
import GlobalDateRangeFilter from "./GlobalDateRangeFilter";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [allSidebarsHidden, setAllSidebarsHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsCalendarOpen(false);
        setIsLeftSidebarOpen(false);
      }
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAllSidebars = () => {
    if (allSidebarsHidden) {
      // Restore previous state
      setIsSidebarOpen(false);
      setIsLeftSidebarOpen(false);
      setIsCalendarOpen(false);
    } else {
      // Hide all sidebars
      setIsSidebarOpen(false);
      setIsLeftSidebarOpen(false);
      setIsCalendarOpen(false);
    }
    setAllSidebarsHidden(!allSidebarsHidden);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-700">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div className="flex-1 flex overflow-hidden pt-16">
        <div 
          className="fixed left-0 top-16 bottom-0 z-30"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`h-full transition-all duration-300 ease-in-out ${isHovering ? 'w-64' : 'w-16'}`}>
            <Sidebar isOpen={isHovering} isMobile={isMobile} />
          </div>
        </div>
        
        <main 
          className={`flex-1 overflow-auto p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg ml-16`}
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
