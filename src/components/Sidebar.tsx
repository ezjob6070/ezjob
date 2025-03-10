import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  ClipboardListIcon, 
  SettingsIcon, 
  LogOutIcon,
  UserPlusIcon,
  FileTextIcon,
  SendIcon,
  WalletIcon,
  DollarSignIcon,
  BarChartIcon,
  WrenchIcon,
  BriefcaseIcon,
  MapIcon,
  CreditCardIcon,
  ReceiptIcon,
  UserRoundIcon,
  CalendarIcon,
  ListChecksIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isOpen: boolean;
  isMobile: boolean;
};

type NavItem = {
  label: string;
  icon: JSX.Element;
  href: string;
};

const Sidebar = ({ isOpen, isMobile }: SidebarProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon size={20} />,
      href: "/",
    },
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
    {
      label: "Tasks",
      icon: <ClipboardListIcon size={20} />,
      href: "/tasks",
    },
    {
      label: "Jobs",
      icon: <BriefcaseIcon size={20} />,
      href: "/jobs",
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
      label: "Technicians",
      icon: <WrenchIcon size={20} />,
      href: "/technicians",
    },
    {
      label: "Employed",
      icon: <UserRoundIcon size={20} />,
      href: "/employed",
    },
    {
      label: "GPS Tracking",
      icon: <MapIcon size={20} />,
      href: "/gps-tracking",
    },
    {
      label: "Job Sources",
      icon: <BriefcaseIcon size={20} />,
      href: "/job-sources",
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

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "",
        isMobile && isOpen ? "shadow-xl" : ""
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold tracking-tight">Essence CRM</h1>
      </div>

      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
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
