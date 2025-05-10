import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Briefcase, 
  FileText, 
  Settings,
  Phone,
  Receipt,
} from "lucide-react";
import { NavItem, IndustryType } from "./sidebarTypes";

export const INDUSTRY_TYPES = {
  SERVICE: 'service',
  REAL_ESTATE: 'real_estate',
  CONSTRUCTION: 'construction',
  GENERAL: 'general'
};

// Update the navigation items to include Estimates with proper highlighting
export const getIndustrySpecificNavItems = (): NavItem[] => {
  // Common menu items across all industries
  const commonItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/",
    },
    {
      label: "Schedule",
      icon: <Calendar size={20} />,
      href: "/schedule",
    },
    {
      label: "Jobs",
      icon: <Briefcase size={20} />,
      href: "/jobs",
    },
    {
      label: "Estimates",
      icon: <Receipt size={20} />,
      href: "/estimates",
    },
    {
      label: "Technicians",
      icon: <Users size={20} />,
      href: "/technicians",
    },
    {
      label: "Job Sources",
      icon: <FileText size={20} />,
      href: "/job-sources",
    },
    {
      label: "Calls",
      icon: <Phone size={20} />,
      href: "/calls",
    },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      href: "/settings",
    },
  ];
  
  return commonItems;
};

export const cycleIndustry = (currentIndustry: IndustryType): IndustryType => {
  switch (currentIndustry) {
    case INDUSTRY_TYPES.SERVICE:
      return INDUSTRY_TYPES.REAL_ESTATE;
    case INDUSTRY_TYPES.REAL_ESTATE:
      return INDUSTRY_TYPES.CONSTRUCTION;
    case INDUSTRY_TYPES.CONSTRUCTION:
      return INDUSTRY_TYPES.GENERAL;
    case INDUSTRY_TYPES.GENERAL:
      return INDUSTRY_TYPES.SERVICE;
    default:
      return INDUSTRY_TYPES.SERVICE;
  }
};
