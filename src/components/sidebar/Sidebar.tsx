
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOutIcon, MenuIcon, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProps, IndustryType } from "./sidebarTypes";
import { INDUSTRY_TYPES, getIndustrySpecificNavItems } from "./sidebarConstants";
import NavItem from "./NavItem";
import { Input } from "@/components/ui/input";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";

const Sidebar = ({ isMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    "leads-clients": true, // Start expanded
  });
  const [technicianSearch, setTechnicianSearch] = useState("");
  
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

  // Filter technicians based on search input
  const filteredTechnicians = initialTechnicians.filter(tech => 
    tech.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(technicianSearch.toLowerCase())
  );

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

        {/* Technician search section */}
        {isHovering && location.pathname.includes("technician") && (
          <div className="px-4 py-2 border-t border-blue-700/30">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-white/80">Find Technicians</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search technicians..."
                className="pl-8 text-sm py-2 h-9 bg-blue-700/30 border-blue-500 text-white placeholder:text-blue-300"
                value={technicianSearch}
                onChange={(e) => setTechnicianSearch(e.target.value)}
              />
            </div>
            
            {/* Technician List */}
            <div className="mt-2 max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {filteredTechnicians.map(tech => (
                  <li key={tech.id}>
                    <Link
                      to={`/technicians/detail/${tech.id}`}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-white/90 hover:bg-blue-700",
                        location.pathname.includes(tech.id) && "bg-blue-700 font-medium"
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/50 text-white">
                        <User size={14} />
                      </div>
                      <div className="truncate">
                        <span>{tech.name}</span>
                        <p className="text-xs text-blue-300">{tech.specialty}</p>
                      </div>
                    </Link>
                  </li>
                ))}
                {filteredTechnicians.length === 0 && (
                  <li className="px-2 py-1.5 text-sm text-blue-300">No technicians found</li>
                )}
              </ul>
            </div>
          </div>
        )}

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
