
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProps, IndustryType } from "./sidebarTypes";
import { INDUSTRY_TYPES, getIndustrySpecificNavItems } from "./sidebarConstants";
import NavItem from "./NavItem";

const Sidebar = ({ isMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
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

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const navItems = getIndustrySpecificNavItems(currentIndustry);

  return (
    <aside
      className="fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "h-full bg-blue-600 overflow-hidden transition-all duration-300",
          isHovering ? "w-64" : "w-16"
        )}
      >
        <div className={cn("py-4", isHovering ? "px-4" : "px-2")}>
          {isHovering ? (
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-white">Dashboard</span>
              <button 
                onClick={cycleIndustry}
                className="p-1 rounded-md hover:bg-blue-700 transition-colors text-white"
              >
                <MenuIcon size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={cycleIndustry}
                className="p-1 rounded-md hover:bg-blue-700 transition-colors text-white"
              >
                <MenuIcon size={20} />
              </button>
            </div>
          )}
        </div>

        <nav className={cn("flex-1 py-2", isHovering ? "px-4" : "px-2")}>
          {isHovering ? (
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href || item.label}>
                  <NavItem 
                    item={item}
                    isExpanded={expandedItems[item.label?.toLowerCase() || ""]}
                    onToggleExpand={() => toggleExpand(item.label?.toLowerCase() || "")}
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
                        (item.children.some(child => location.pathname === child.href))
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

        <div className={cn("p-4 border-t border-blue-700/50", !isHovering && "flex justify-center")}>
          {isHovering ? (
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
      </div>
    </aside>
  );
};

export default Sidebar;
