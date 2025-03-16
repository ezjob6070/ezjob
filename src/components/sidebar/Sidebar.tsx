
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOutIcon, ChevronLeftIcon, MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProps, IndustryType } from "./sidebarTypes";
import { INDUSTRY_TYPES, getIndustrySpecificNavItems } from "./sidebarConstants";
import NavItem from "./NavItem";
import SidebarHeader from "./SidebarHeader";

const Sidebar = ({ isOpen, isMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    "leads-clients": true, // Start expanded
  });
  
  // In a real implementation, this would come from user context or similar
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>(INDUSTRY_TYPES[2]); // Default to general
  
  // For demo purposes only - toggle between industries
  const cycleIndustry = () => {
    const currentIndex = INDUSTRY_TYPES.indexOf(currentIndustry);
    const nextIndex = (currentIndex + 1) % INDUSTRY_TYPES.length;
    const nextIndustry = INDUSTRY_TYPES[nextIndex];
    setCurrentIndustry(nextIndustry);
    
    // Navigate to real estate dashboard when real_estate is selected
    if (nextIndustry === 'real_estate' && location.pathname === '/') {
      navigate('/real-estate-dashboard');
    } else if (nextIndustry !== 'real_estate' && location.pathname === '/real-estate-dashboard') {
      navigate('/');
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navItems = getIndustrySpecificNavItems(currentIndustry);

  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-blue-600 text-white transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className={cn("py-4", isOpen ? "px-4" : "px-2")}>
        {isOpen ? (
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Dashboard</span>
            <button 
              onClick={cycleIndustry}
              className="p-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={cycleIndustry}
              className="p-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 py-6", isOpen ? "px-4" : "px-2")}>
        {isOpen ? (
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href || item.label}>
                <NavItem 
                  item={item}
                  isExpanded={expandedItems["leads-clients"]}
                  onToggleExpand={() => toggleExpand("leads-clients")}
                  currentPath={location.pathname}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4 flex flex-col items-center">
            {navItems.map((item) => (
              <li key={item.href || item.label} className="w-full flex justify-center">
                {!item.children && item.href && (
                  <Link 
                    to={item.href} 
                    className={cn(
                      "p-2 rounded-lg transition-colors duration-200 flex justify-center",
                      location.pathname === item.href
                        ? "bg-blue-700 text-white"
                        : "text-white/80 hover:bg-blue-700 hover:text-white"
                    )}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                )}
                {item.children && (
                  <button
                    className={cn(
                      "p-2 rounded-lg transition-colors duration-200 flex justify-center",
                      (location.pathname === "/leads" || location.pathname === "/clients")
                        ? "bg-blue-700 text-white"
                        : "text-white/80 hover:bg-blue-700 hover:text-white"
                    )}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className={cn("p-4 border-t border-blue-700/50", !isOpen && "flex justify-center")}>
        {isOpen ? (
          <button className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-blue-700 hover:text-white transition-colors duration-200">
            <LogOutIcon size={20} />
            <span>Sign out</span>
          </button>
        ) : (
          <button 
            className="p-2 rounded-lg text-white/80 hover:bg-blue-700 hover:text-white transition-colors duration-200"
            title="Sign out"
          >
            <LogOutIcon size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
