
import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  ClipboardListIcon, 
  SettingsIcon, 
  LogOutIcon,
  UserPlusIcon,
  FileTextIcon,
  WalletIcon,
  BriefcaseIcon,
  MapIcon,
  CreditCardIcon,
  WrenchIcon,
  UserRoundIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingIcon,
  HomeIcon as HouseIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SidebarProps = {
  isOpen: boolean;
  isMobile: boolean;
};

type NavItem = {
  label: string;
  icon: JSX.Element;
  href?: string;
  children?: NavItem[];
  industries?: string[]; // Only show for specific industries
};

// This would come from user selection/login in a real app
const INDUSTRY_TYPES = ['construction', 'real_estate', 'general'] as const;
type IndustryType = typeof INDUSTRY_TYPES[number];

const Sidebar = ({ isOpen, isMobile }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    "leads-clients": true, // Start expanded
  });
  
  // In a real implementation, this would come from user context or similar
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('general');
  
  // For demo purposes only - toggle between industries
  const cycleIndustry = () => {
    const currentIndex = INDUSTRY_TYPES.indexOf(currentIndustry);
    const nextIndex = (currentIndex + 1) % INDUSTRY_TYPES.length;
    setCurrentIndustry(INDUSTRY_TYPES[nextIndex]);
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getIndustrySpecificNavItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      {
        label: "Dashboard",
        icon: <HomeIcon size={20} />,
        href: "/",
      },
      {
        label: "Leads & Clients",
        icon: <UsersIcon size={20} />,
        children: [
          {
            label: "Leads",
            icon: <UserPlusIcon size={20} />,
            href: "/leads",
          },
          {
            label: "Clients",
            icon: <UsersIcon size={20} />,
            href: "/clients",
          },
        ],
      },
      {
        label: "Tasks",
        icon: <ClipboardListIcon size={20} />,
        href: "/tasks",
      },
      {
        label: "Schedule",
        icon: <CalendarIcon size={20} />,
        href: "/schedule",
      },
      {
        label: "Estimates",
        icon: <FileTextIcon size={20} />,
        href: "/estimates",
      },
      {
        label: "Payments & Invoices",
        icon: <CreditCardIcon size={20} />,
        href: "/payments",
      },
      {
        label: "Finance & Reports",
        icon: <WalletIcon size={20} />,
        href: "/finance",
      },
      {
        label: "Settings",
        icon: <SettingsIcon size={20} />,
        href: "/settings",
      },
    ];
    
    // Industry-specific items
    const constructionItems: NavItem[] = [
      {
        label: "Jobs",
        icon: <BriefcaseIcon size={20} />,
        href: "/jobs",
        industries: ['construction'],
      },
      {
        label: "Technicians",
        icon: <WrenchIcon size={20} />,
        href: "/technicians",
        industries: ['construction'],
      },
      {
        label: "Employed",
        icon: <UserRoundIcon size={20} />,
        href: "/employed",
        industries: ['construction'],
      },
      {
        label: "GPS Tracking",
        icon: <MapIcon size={20} />,
        href: "/gps-tracking",
        industries: ['construction'],
      },
      {
        label: "Job Sources",
        icon: <BriefcaseIcon size={20} />,
        href: "/job-sources",
        industries: ['construction'],
      },
    ];
    
    const realEstateItems: NavItem[] = [
      {
        label: "Properties",
        icon: <HouseIcon size={20} />,
        href: "/properties",
        industries: ['real_estate'],
      },
      {
        label: "Agents",
        icon: <UserRoundIcon size={20} />,
        href: "/agents",
        industries: ['real_estate'],
      },
      {
        label: "Listings",
        icon: <BuildingIcon size={20} />,
        href: "/listings",
        industries: ['real_estate'],
      },
    ];
    
    // Combine and filter based on current industry
    return [
      ...commonItems,
      ...constructionItems.filter(item => 
        !item.industries || item.industries.includes(currentIndustry)
      ),
      ...realEstateItems.filter(item => 
        !item.industries || item.industries.includes(currentIndustry)
      ),
    ];
  };
  
  const navItems = getIndustrySpecificNavItems();

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "",
        isMobile && isOpen ? "shadow-xl" : ""
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold tracking-tight">Essence CRM</h1>
        <div className="flex items-center">
          <button 
            onClick={cycleIndustry}
            className="text-xs bg-sidebar-accent/30 px-2 py-1 rounded-md"
          >
            {currentIndustry.replace('_', ' ')}
          </button>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href || item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand("leads-clients")}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors duration-200",
                      (location.pathname === "/leads" || location.pathname === "/clients")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {expandedItems["leads-clients"] ? (
                      <ChevronUpIcon size={16} />
                    ) : (
                      <ChevronDownIcon size={16} />
                    )}
                  </button>
                  {expandedItems["leads-clients"] && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href!}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200",
                              location.pathname === child.href
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
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
