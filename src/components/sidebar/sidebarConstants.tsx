
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
  Users,
  LayoutDashboardIcon,
  PhoneIcon,
  MessageSquareIcon,
  GlobeIcon,
  DatabaseIcon,
  UserIcon,
  PhoneCallIcon,  // Added phone-call icon
  PhoneOutgoingIcon, // Added phone outgoing icon
  PhoneIncomingIcon, // Added phone incoming icon
  PhoneXIcon, // Added phone-x icon
} from "lucide-react";
import { NavItem, IndustryType } from "./sidebarTypes";

// Update industry types to include general
export const INDUSTRY_TYPES = ['service', 'real_estate', 'construction', 'general'] as const;

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
    href: "/leads-clients",
  },
  {
    label: "Calls",
    icon: <PhoneCallIcon size={20} />,
    children: [
      {
        label: "All Calls",
        icon: <PhoneCallIcon size={20} />,
        href: "/calls",
      },
      {
        label: "Incoming Calls",
        icon: <PhoneIncomingIcon size={20} />,
        href: "/calls/incoming",
      },
      {
        label: "Outgoing Calls",
        icon: <PhoneOutgoingIcon size={20} />,
        href: "/calls/outgoing",
      },
      {
        label: "Missed Calls",
        icon: <PhoneXIcon size={20} />,
        href: "/calls/missed",
      },
      {
        label: "Converted Calls",
        icon: <UserPlusIcon size={20} />,
        href: "/calls/converted",
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

// Add service specific nav items with direct links
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

// Add general category specific nav items
export const getGeneralNavItems = (): NavItem[] => [
  {
    label: "Contacts",
    icon: <UsersIcon size={20} />,
    href: "/contacts",
    industries: ['general'],
  },
  {
    label: "Employees",
    icon: <UserRoundIcon size={20} />,
    href: "/employed",
    industries: ['general'],
  },
  {
    label: "Communications",
    icon: <MessageSquareIcon size={20} />,
    href: "/communications",
    industries: ['general'],
  },
  {
    label: "Projects",
    icon: <ClipboardListIcon size={20} />,
    href: "/general-projects",
    industries: ['general'],
  },
  {
    label: "Office Management",
    icon: <LayoutDashboardIcon size={20} />,
    href: "/office-management",
    industries: ['general'],
  },
  {
    label: "Customer Support",
    icon: <PhoneIcon size={20} />,
    href: "/customer-support",
    industries: ['general'],
  },
  {
    label: "Marketing",
    icon: <GlobeIcon size={20} />,
    href: "/marketing",
    industries: ['general'],
  },
  {
    label: "Knowledge Base",
    icon: <DatabaseIcon size={20} />,
    href: "/knowledge-base",
    industries: ['general'],
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
  
  // Add construction-specific items with customized dashboard
  if (currentIndustry === 'construction') {
    // Replace the dashboard link for construction
    navItems = navItems.map(item => 
      item.label === "Dashboard" 
        ? { ...item, href: "/construction-dashboard" } 
        : item
    );
    navItems = [...navItems, ...getConstructionNavItems()];
  }
  
  // Add general-specific items with customized dashboard
  if (currentIndustry === 'general') {
    // Replace the dashboard link for general
    navItems = navItems.map(item => 
      item.label === "Dashboard" 
        ? { ...item, href: "/general-dashboard" } 
        : item
    );
    navItems = [...navItems, ...getGeneralNavItems()];
  }
  
  return navItems;
};
