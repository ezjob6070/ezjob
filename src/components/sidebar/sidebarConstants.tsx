
import { 
  HomeIcon, 
  UsersIcon, 
  ClipboardListIcon, 
  SettingsIcon, 
  UserPlusIcon,
  FileTextIcon,
  WalletIcon,
  BriefcaseIcon,
  MapIcon,
  CreditCardIcon,
  WrenchIcon,
  UserRoundIcon,
  CalendarIcon,
  BuildingIcon,
  HomeIcon as HouseIcon,
  HardHatIcon,
  ConstructionIcon,
  TruckIcon,
  LayersIcon,
  ClipboardCheckIcon,
  Users
} from "lucide-react";
import { NavItem, IndustryType } from "./sidebarTypes";

// Update industry types to include construction
export const INDUSTRY_TYPES = ['service', 'real_estate', 'construction'] as const;

// Navigation items organized by category and industry
export const getCommonNavItems = (): NavItem[] => [
  {
    label: "Dashboard",
    icon: <HomeIcon size={20} />,
    href: "/dashboard",
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

export const getServiceNavItems = (): NavItem[] => [
  {
    label: "Jobs",
    icon: <BriefcaseIcon size={20} />,
    href: "/jobs",
    industries: ['service'],
  },
  {
    label: "Technicians",
    icon: <WrenchIcon size={20} />,
    href: "/technicians",
    industries: ['service'],
  },
  {
    label: "Employed",
    icon: <UserRoundIcon size={20} />,
    href: "/employed",
    industries: ['service'],
  },
  {
    label: "GPS Tracking",
    icon: <MapIcon size={20} />,
    href: "/gps-tracking",
    industries: ['service'],
  },
  {
    label: "Job Sources",
    icon: <BriefcaseIcon size={20} />,
    href: "/job-sources",
    industries: ['service'],
  },
];

// Add construction specific nav items with direct links
export const getConstructionNavItems = (): NavItem[] => [
  {
    label: "Projects",
    icon: <ConstructionIcon size={20} />,
    href: "/projects",
    industries: ['construction'],
  },
  {
    label: "Equipment",
    icon: <TruckIcon size={20} />,
    href: "/equipment",
    industries: ['construction'],
  },
  {
    label: "Materials",
    icon: <LayersIcon size={20} />,
    href: "/materials",
    industries: ['construction'],
  },
  {
    label: "Contractors",
    icon: <Users size={20} />,
    href: "/contractors",
    industries: ['construction'],
  },
  {
    label: "Safety Reports",
    icon: <HardHatIcon size={20} />,
    href: "/safety-reports",
    industries: ['construction'],
  },
  {
    label: "Inspections",
    icon: <ClipboardCheckIcon size={20} />,
    href: "/inspections",
    industries: ['construction'],
  },
];

export const getRealEstateNavItems = (): NavItem[] => [
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

export const getIndustrySpecificNavItems = (currentIndustry: IndustryType): NavItem[] => {
  let navItems = [
    ...getCommonNavItems(),
  ];
  
  // Add service-specific items
  if (currentIndustry === 'service') {
    navItems = [...navItems, ...getServiceNavItems()];
  }
  
  // Add real estate-specific items
  if (currentIndustry === 'real_estate') {
    // Replace the dashboard link for real estate
    navItems = navItems.map(item => 
      item.label === "Dashboard" 
        ? { ...item, href: "/real-estate-dashboard" } 
        : item
    );
    navItems = [...navItems, ...getRealEstateNavItems()];
  }
  
  // Add construction-specific items
  if (currentIndustry === 'construction') {
    navItems = [...navItems, ...getConstructionNavItems()];
  }
  
  return navItems;
};
