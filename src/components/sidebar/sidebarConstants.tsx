
import React from "react";
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  SettingsIcon, 
  ClipboardIcon, 
  PhoneIcon, 
  CreditCardIcon,
  BriefcaseIcon,
  UserIcon,
  WrenchIcon,
  MapPinIcon,
  FileTextIcon,
  CircleDollarSign,
  FolderIcon,
} from "lucide-react";
import { NavItem } from "./sidebarTypes";

export const INDUSTRY_TYPES = {
  SERVICE: "service",
};

// Navigation items for service industry
const commonNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <HomeIcon size={18} />,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: <FolderIcon size={18} />,
    href: "/projects",
  },
  {
    label: "Leads & Clients",
    icon: <UsersIcon size={18} />,
    href: "/leads-clients",
  },
  {
    label: "Schedule",
    icon: <CalendarIcon size={18} />,
    href: "/schedule",
  },
  {
    label: "Tasks",
    icon: <ClipboardIcon size={18} />,
    href: "/tasks",
  },
  {
    label: "Calls",
    icon: <PhoneIcon size={18} />,
    href: "/calls",
  },
  {
    label: "Jobs",
    icon: <BriefcaseIcon size={18} />,
    href: "/jobs",
  },
  {
    label: "Team Management",
    icon: <WrenchIcon size={18} />,
    href: "/technicians",
  },
  {
    label: "Estimates & Quotes",
    icon: <FileTextIcon size={18} />,
    href: "/estimates",
  },
  {
    label: "Payments",
    icon: <CreditCardIcon size={18} />,
    href: "/payments",
  },
  {
    label: "Finance & Reports",
    icon: <CircleDollarSign size={18} />,
    href: "/finance",
  },
  {
    label: "GPS Tracking",
    icon: <MapPinIcon size={18} />,
    href: "/gps-tracking",
  },
  {
    label: "Job Sources",
    icon: <FileTextIcon size={18} />,
    href: "/job-sources",
  },
  {
    label: "Employed",
    icon: <UsersIcon size={18} />,
    href: "/employed",
  },
  {
    label: "Settings",
    icon: <SettingsIcon size={18} />,
    href: "/settings",
  },
];

// Export only service navigation items
export const getIndustrySpecificNavItems = (): NavItem[] => {
  return commonNavItems;
};
