
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "",
        isMobile && isOpen ? "shadow-xl" : ""
      )}
    >
      <SidebarHeader industry={currentIndustry} onCycleIndustry={cycleIndustry} />

      <nav className="flex-1 py-6 px-4">
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
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-200">
          <LogOutIcon size={20} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
