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
  BuildingIcon,
  MapPinIcon,
  ReceiptIcon,
  FileTextIcon,
  TruckIcon,
  WrenchIcon, // Changed from ToolIcon to WrenchIcon which exists in lucide-react
  BarChartIcon,
  SlidersIcon,
  FolderIcon,
  BookIcon,
  FileIcon,
  ListIcon,
  HeadphonesIcon,
  MessageSquareIcon,
  MailIcon,
  BookOpenIcon,
  PresentationIcon,
  CircleDollarSign,
} from "lucide-react";
import { NavItem } from "./sidebarTypes";

export const INDUSTRY_TYPES = {
  SERVICE: "service",
  REAL_ESTATE: "real_estate",
  CONSTRUCTION: "construction",
  GENERAL: "general"
};

// Common navigation items for all industries
const commonNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <HomeIcon size={18} />,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: <FolderIcon size={18} />,
    children: [
      {
        label: "Project Overview",
        icon: <FolderIcon size={16} />,
        href: "/projects",
      },
      {
        label: "In Progress",
        icon: <FileIcon size={16} />,
        href: "/projects/in-progress",
      },
      {
        label: "All Projects",
        icon: <ListIcon size={16} />,
        href: "/projects/all",
      },
      {
        label: "Total Projects",
        icon: <BarChartIcon size={16} />,
        href: "/projects/total",
      },
    ],
  },
  {
    label: "Leads & Clients",
    icon: <UsersIcon size={18} />,
    children: [
      {
        label: "Combined View",
        icon: <UsersIcon size={16} />,
        href: "/leads-clients",
      },
      {
        label: "Leads",
        icon: <UserIcon size={16} />,
        href: "/leads",
      },
      {
        label: "Clients",
        icon: <UsersIcon size={16} />,
        href: "/clients",
      },
    ],
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
    children: [
      {
        label: "All Calls",
        icon: <PhoneIcon size={16} />,
        href: "/calls",
      },
      {
        label: "Incoming",
        icon: <PhoneIcon size={16} />,
        href: "/calls/incoming",
      },
      {
        label: "Outgoing",
        icon: <PhoneIcon size={16} />,
        href: "/calls/outgoing",
      },
      {
        label: "Missed",
        icon: <PhoneIcon size={16} />,
        href: "/calls/missed",
      },
      {
        label: "Converted",
        icon: <PhoneIcon size={16} />,
        href: "/calls/converted",
      },
    ],
  },
  {
    label: "Settings",
    icon: <SettingsIcon size={18} />,
    href: "/settings",
  },
];

// Service industry specific navigation items
const serviceNavItems: NavItem[] = [
  {
    label: "Jobs",
    icon: <BriefcaseIcon size={18} />,
    href: "/jobs",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Technicians",
    icon: <WrenchIcon size={18} />, // Updated from ToolIcon
    href: "/technicians",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Estimates",
    icon: <FileTextIcon size={18} />,
    href: "/estimates",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Payments",
    icon: <CreditCardIcon size={18} />,
    href: "/payments",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Finance & Reports",
    icon: <CircleDollarSign size={18} />,
    href: "/finance",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "GPS Tracking",
    icon: <MapPinIcon size={18} />,
    href: "/gps-tracking",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Job Sources",
    icon: <FileIcon size={18} />,
    href: "/job-sources",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
  {
    label: "Employed",
    icon: <UsersIcon size={18} />,
    href: "/employed",
    industries: [INDUSTRY_TYPES.SERVICE]
  },
];

// Real estate industry specific navigation items
const realEstateNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <HomeIcon size={18} />,
    href: "/real-estate-dashboard",
    industries: [INDUSTRY_TYPES.REAL_ESTATE]
  },
  {
    label: "Agents",
    icon: <UserIcon size={18} />,
    href: "/agents",
    industries: [INDUSTRY_TYPES.REAL_ESTATE]
  },
  {
    label: "Properties",
    icon: <BuildingIcon size={18} />,
    href: "/properties",
    industries: [INDUSTRY_TYPES.REAL_ESTATE]
  },
  {
    label: "Listings",
    icon: <ListIcon size={18} />,
    href: "/listings",
    industries: [INDUSTRY_TYPES.REAL_ESTATE]
  },
];

// Construction industry specific navigation items
const constructionNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <HomeIcon size={18} />,
    href: "/construction-dashboard",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Projects",
    icon: <FolderIcon size={18} />,
    href: "/construction-projects", // Updated to match the new route
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Equipment",
    icon: <WrenchIcon size={18} />, // Updated from ToolIcon
    href: "/equipment",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Materials",
    icon: <TruckIcon size={18} />,
    href: "/materials",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Contractors",
    icon: <UsersIcon size={18} />,
    href: "/contractors",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Safety Reports",
    icon: <ClipboardIcon size={18} />,
    href: "/safety-reports",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
  {
    label: "Inspections",
    icon: <FileTextIcon size={18} />,
    href: "/inspections",
    industries: [INDUSTRY_TYPES.CONSTRUCTION]
  },
];

// General industry specific navigation items
const generalNavItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <HomeIcon size={18} />,
    href: "/general-dashboard",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Communications",
    icon: <MessageSquareIcon size={18} />,
    href: "/communications",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Projects",
    icon: <FolderIcon size={18} />,
    href: "/projects",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Contacts",
    icon: <BookIcon size={18} />,
    href: "/contacts",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Office Management",
    icon: <BuildingIcon size={18} />,
    href: "/office-management",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Customer Support",
    icon: <HeadphonesIcon size={18} />,
    href: "/customer-support",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Marketing",
    icon: <PresentationIcon size={18} />,
    href: "/marketing",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
  {
    label: "Knowledge Base",
    icon: <BookOpenIcon size={18} />,
    href: "/knowledge-base",
    industries: [INDUSTRY_TYPES.GENERAL]
  },
];

export const getIndustrySpecificNavItems = (industry: string): NavItem[] => {
  // Filter common nav items to avoid duplicates with industry specific items
  const filteredCommonItems = commonNavItems.filter(item => {
    // For dashboard, show only the industry specific dashboard
    if (item.label === "Dashboard" && industry !== "service") {
      return false;
    }
    
    // For projects, show only the common projects page for service and on others show industry specific
    if (item.label === "Projects" && industry !== "service") {
      return false;
    }
    
    return true;
  });
  
  switch (industry) {
    case INDUSTRY_TYPES.REAL_ESTATE:
      return [...filteredCommonItems, ...realEstateNavItems];
    case INDUSTRY_TYPES.CONSTRUCTION:
      return [...filteredCommonItems, ...constructionNavItems];
    case INDUSTRY_TYPES.GENERAL:
      return [...filteredCommonItems, ...generalNavItems];
    default:
      return [...filteredCommonItems, ...serviceNavItems];
  }
};
