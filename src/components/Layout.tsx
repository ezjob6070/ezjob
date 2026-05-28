import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useGlobalState } from "./providers/GlobalStateProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Access GlobalState to verify the provider is available
  useGlobalState();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Mobile top bar */}
      {isMobile && (
        <header className="sticky top-0 z-40 flex items-center justify-between px-3 py-2 bg-white/95 backdrop-blur border-b border-gray-200">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 max-w-[85vw] border-r-0">
              <Sidebar isMobile mobileExpanded />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-blue-700">EZ Job</span>
          <div className="w-9" />
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar */}
        {!isMobile && <Sidebar isMobile={false} />}

        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            "p-3 sm:p-4 md:p-6",
            !isMobile && "ml-16",
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
