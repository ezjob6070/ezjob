
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Building, 
  Home, 
  LogOutIcon, 
  MenuIcon, 
  WrenchIcon, 
  Construction, 
  ArrowLeftCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProps, IndustryType } from "./sidebarTypes";
import { INDUSTRY_TYPES, getIndustrySpecificNavItems } from "./sidebarConstants";
import NavItem from "./NavItem";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    "leads-clients": true,
  });
  
  const { currentIndustry, setCurrentIndustry } = useGlobalState();
  
  const handleIndustryChange = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    
    // Navigate based on current industry
    if (industry === 'real_estate') {
      navigate('/real-estate-dashboard');
    } else {
      navigate('/dashboard');
    }

    toast({
      title: `Switched to ${industry.replace('_', ' ')} CRM`,
      description: `Now viewing ${industry.replace('_', ' ')} dashboard`,
    });
  };

  const goToWelcomePage = () => {
    navigate('/');
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
      className="fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={cn(
          "h-full bg-gradient-to-b from-blue-700 to-blue-900 shadow-lg overflow-hidden transition-all duration-300",
          isHovering ? "w-64" : "w-16"
        )}
      >
        <div className={cn("py-4", isHovering ? "px-3" : "px-2")}>
          <div className={cn("flex flex-col gap-2", !isHovering && "items-center")}>
            <button
              onClick={() => handleIndustryChange('service')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                currentIndustry === 'service' ? "bg-blue-600 text-white" : "text-white/80 hover:bg-blue-600 hover:text-white"
              )}
            >
              <WrenchIcon className="h-5 w-5" />
              {isHovering && <span>Service</span>}
            </button>
            <button
              onClick={() => handleIndustryChange('real_estate')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                currentIndustry === 'real_estate' ? "bg-blue-600 text-white" : "text-white/80 hover:bg-blue-600 hover:text-white"
              )}
            >
              <Home className="h-5 w-5" />
              {isHovering && <span>Real Estate</span>}
            </button>
            <button
              onClick={() => handleIndustryChange('construction')}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                currentIndustry === 'construction' ? "bg-blue-600 text-white" : "text-white/80 hover:bg-blue-600 hover:text-white"
              )}
            >
              <Construction className="h-5 w-5" />
              {isHovering && <span>Construction</span>}
            </button>
          </div>
        </div>

        <div className="mx-2 mb-4 border-t border-blue-600/50" />

        {/* Choose Different Category Button - More prominent */}
        <div className={cn("px-2", isHovering && "px-4")}>
          <Button
            variant="outline"
            onClick={goToWelcomePage}
            className={cn(
              "w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-500 flex items-center justify-center gap-2",
              !isHovering && "p-2"
            )}
          >
            <ArrowLeftCircle size={isHovering ? 18 : 16} />
            {isHovering && <span>Choose Different Category</span>}
          </Button>
        </div>

        <div className="mx-2 my-4 border-t border-blue-600/50" />

        <div className={cn("py-3", isHovering ? "px-5" : "px-3")}>
          {isHovering ? (
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-white">Uleadz CRM</span>
              <button 
                onClick={() => {}}
                className="p-1.5 rounded-md hover:bg-blue-600 transition-all text-white/90 hover:text-white"
              >
                <MenuIcon size={18} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => {}}
                className="p-1.5 rounded-md hover:bg-blue-600 transition-colors text-white/90 hover:text-white"
              >
                <MenuIcon size={18} />
              </button>
            </div>
          )}
        </div>

        <nav className={cn("flex-1 py-3", isHovering ? "px-4" : "px-2")}>
          {isHovering ? (
            <ul className="space-y-1.5">
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
                        "p-2 rounded-lg transition-all duration-200 flex justify-center",
                        location.pathname === item.href
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-white/80 hover:bg-blue-600 hover:text-white"
                      )}
                      title={item.label}
                    >
                      {item.icon}
                    </Link>
                  )}
                  {item.children && (
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200 flex justify-center",
                        (item.children.some(child => location.pathname === child.href))
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-white/80 hover:bg-blue-600 hover:text-white"
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

        <div className={cn("p-4 mt-auto border-t border-blue-700/50", !isHovering && "flex justify-center")}>
          {isHovering ? (
            <>
              <button className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-blue-600 hover:text-white transition-all duration-200">
                <LogOutIcon size={18} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className="p-2 rounded-lg text-white/80 hover:bg-blue-600 hover:text-white transition-all duration-200"
                title="Sign out"
              >
                <LogOutIcon size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
