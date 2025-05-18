
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Calendar, BarChart2, Users, FileText, 
  Settings, Menu, ChevronRight, ChevronLeft,
  Home, Briefcase, DollarSign, Tool, ClipboardList, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isMobile?: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const Sidebar = ({ isMobile }: SidebarProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Users, label: 'Clients', path: '/clients' },
    { icon: Tool, label: 'Technicians', path: '/technicians' },
    { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: DollarSign, label: 'Finance', path: '/finance' },
    { icon: FileText, label: 'Estimates', path: '/estimates' },
    { icon: Building, label: 'Projects', path: '/projects' },
  ];
  
  const secondaryNavItems: NavItem[] = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Building, label: 'Company Profile', path: '/company-profile' },
  ];
  
  return (
    <aside 
      className={cn(
        "bg-blue-950 text-white z-10 transition-all duration-300 flex flex-col",
        expanded ? "w-56" : "w-16",
        isMobile && !expanded ? "absolute top-0 bottom-0" : ""
      )}
    >
      <div className="flex justify-end p-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-blue-900/50"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        <nav className="px-2 space-y-1">
          <TooltipProvider delayDuration={0}>
            {mainNavItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center p-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-blue-800/80 text-white" 
                          : "text-blue-200 hover:bg-blue-900/50 hover:text-white",
                        !expanded && "justify-center"
                      )
                    }
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {expanded && <span className="ml-3 text-sm">{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {!expanded && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        
        <div className="mt-8">
          <div className={cn("px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider", 
            !expanded && "text-center"
          )}>
            {expanded ? "Settings" : "⚙️"}
          </div>
          <nav className="mt-2 px-2 space-y-1">
            <TooltipProvider delayDuration={0}>
              {secondaryNavItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center p-2 rounded-md transition-colors",
                          isActive 
                            ? "bg-blue-800/80 text-white" 
                            : "text-blue-200 hover:bg-blue-900/50 hover:text-white",
                          !expanded && "justify-center"
                        )
                      }
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {expanded && <span className="ml-3 text-sm">{item.label}</span>}
                    </NavLink>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
