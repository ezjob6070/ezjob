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
  HomeIcon as HouseIcon
} from "lucide-react";
import { NavItem, IndustryType } from "./sidebarTypes";

// Industry type constants - change 'construction' to 'service'
export const INDUSTRY_TYPES = ['service', 'real_estate'] as const;

// Navigation items organized by category and industry
export const getCommonNavItems = (): NavItem[] => [
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

export const getConstructionNavItems = (): NavItem[] => [
  {
    label: "Jobs",
    icon: <BriefcaseIcon size={20} />,
    href: "/jobs",
    industries: ['service'], // Change from 'construction' to 'service'
  },
  {
    label: "Technicians",
    icon: <WrenchIcon size={20} />,
    href: "/technicians",
    industries: ['service'], // Change from 'construction' to 'service'
  },
  {
    label: "Employed",
    icon: <UserRoundIcon size={20} />,
    href: "/employed",
    industries: ['service'], // Change from 'construction' to 'service'
  },
  {
    label: "GPS Tracking",
    icon: <MapIcon size={20} />,
    href: "/gps-tracking",
    industries: ['service'], // Change from 'construction' to 'service'
  },
  {
    label: "Job Sources",
    icon: <BriefcaseIcon size={20} />,
    href: "/job-sources",
    industries: ['service'], // Change from 'construction' to 'service'
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
    navItems = [...navItems, ...getConstructionNavItems()];
  }
  
  // Add real estate-specific items
  if (currentIndustry === 'real_estate') {
    navItems = [...navItems, ...getRealEstateNavItems()];
  }
  
  return navItems;
};
