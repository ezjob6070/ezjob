
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CalendarSidebar from "./calendar/CalendarSidebar";
import LeftCalendarSidebar from "./calendar/LeftCalendarSidebar";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLeftCalendarOpen, setIsLeftCalendarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsCalendarOpen(false);
        setIsLeftCalendarOpen(false);
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

  const toggleLeftCalendar = () => {
    console.log("Toggling left calendar:", !isLeftCalendarOpen);
    setIsLeftCalendarOpen(!isLeftCalendarOpen);
  };

  // Hide calendar buttons on Finance page
  const isFinancePage = location.pathname === "/finance";

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-blue-700">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
      />
      <div className="flex-1 flex overflow-hidden pt-16"> {/* Added pt-16 to account for the fixed header */}
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <LeftCalendarSidebar isOpen={isLeftCalendarOpen} />
        <main 
          className={`flex-1 overflow-auto p-6 transition-all duration-300 bg-white/10 backdrop-blur-lg
            ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}
            ${isLeftCalendarOpen && !isMobile ? 'ml-80' : ''}
            ${isCalendarOpen && !isMobile ? 'mr-80' : 'mr-0'}`}
        >
          <div className="max-w-6xl mx-auto animate-fade-in rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg">
            {!isFinancePage && (
              <div className="flex justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={toggleLeftCalendar}
                  className="gap-2"
                >
                  <CalendarIcon size={16} />
                  {isLeftCalendarOpen ? "Hide Calendar" : "Show Calendar"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="gap-2"
                >
                  <CalendarIcon size={16} />
                  {isCalendarOpen ? "Hide Schedule" : "Show Schedule"}
                </Button>
              </div>
            )}
            <Outlet />
          </div>
        </main>
        <CalendarSidebar isOpen={isCalendarOpen} />
      </div>
    </div>
  );
};

export default Layout;
