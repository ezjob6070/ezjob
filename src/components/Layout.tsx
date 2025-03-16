
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CalendarSidebar from "./calendar/CalendarSidebar";
import LeftCalendarSidebar from "./calendar/LeftCalendarSidebar";
import GlobalDateRangeFilter from "./GlobalDateRangeFilter";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsCalendarOpen(false);
        setIsLeftSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-700">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        
        {/* Toggle sidebar button */}
        {!isMobile && (
          <div className={`fixed z-30 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-16'}`}>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={toggleSidebar} 
              className="h-8 w-8 rounded-full shadow-md"
            >
              {isSidebarOpen ? <ChevronLeftIcon size={16} /> : <ChevronRightIcon size={16} />}
            </Button>
          </div>
        )}
        
        <LeftCalendarSidebar isOpen={isLeftSidebarOpen} />
        <main 
          className={`flex-1 overflow-auto p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg
            ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-16'}
            ${isLeftSidebarOpen && !isMobile ? 'ml-80' : ''}
            ${isCalendarOpen && !isMobile ? 'mr-80' : 'mr-0'}`}
        >
          <div className="mb-4">
            <GlobalDateRangeFilter />
          </div>
          <div className="max-w-6xl mx-auto animate-fade-in rounded-xl bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <Outlet />
          </div>
        </main>
        <CalendarSidebar isOpen={isCalendarOpen} />
      </div>
    </div>
  );
};

export default Layout;
