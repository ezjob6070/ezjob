
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
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  PhoneOffIcon,
  UserPlusIcon
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
    children: [
      {
        label: "All Contacts",
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
    href: "/calls",
    children: [
      {
        label: "All Calls",
        icon: <PhoneIcon size={16} />,
        href: "/calls",
      },
      {
        label: "Incoming",
        icon: <PhoneIncomingIcon size={16} className="text-green-500" />,
        href: "/calls/incoming",
      },
      {
        label: "Outgoing",
        icon: <PhoneOutgoingIcon size={16} className="text-blue-500" />,
        href: "/calls/outgoing",
      },
      {
        label: "Not Answered",
        icon: <PhoneOffIcon size={16} className="text-red-500" />,
        href: "/calls/not_answered",
      },
      {
        label: "Converted",
        icon: <UserPlusIcon size={16} className="text-amber-500" />,
        href: "/calls/converted",
      },
    ],
  },
  {
    label: "Operations",
    icon: <BriefcaseIcon size={18} />,
    children: [
      {
        label: "Jobs",
        icon: <BriefcaseIcon size={16} />,
        href: "/jobs",
      },
      {
        label: "Technicians",
        icon: <WrenchIcon size={16} />,
        href: "/technicians",
      },
      {
        label: "Job Sources",
        icon: <FileTextIcon size={16} />,
        href: "/job-sources",
      },
      {
        label: "Employees",
        icon: <UsersIcon size={16} />,
        href: "/employed",
      },
    ]
  },
  {
    label: "Finance",
    icon: <CircleDollarSign size={18} />,
    children: [
      {
        label: "Overview",
        icon: <CircleDollarSign size={16} />,
        href: "/finance",
      },
      {
        label: "Estimates",
        icon: <FileTextIcon size={16} />,
        href: "/estimates",
      },
      {
        label: "Payments",
        icon: <CreditCardIcon size={16} />,
        href: "/payments",
      },
    ]
  },
  {
    label: "GPS Tracking",
    icon: <MapPinIcon size={18} />,
    href: "/gps-tracking",
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
