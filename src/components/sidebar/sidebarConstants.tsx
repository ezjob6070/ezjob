
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  User, 
  ClipboardList, 
  Building2, 
  Briefcase, 
  BadgeDollarSign, 
  Settings, 
  Home, 
  CalendarCheck,
  Phone,
  MapPin,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  FileBarChart,
  ShieldCheck,
  FileSearch,
  MessageSquare,
  Mail,
  Package,
  BarChart,
  Book,
  Receipt,
  Coins,
  ScrollText,
} from "lucide-react";
import { NavItem } from "./sidebarTypes";

// Define the navigation items for different industries
export const getIndustrySpecificNavItems = (): NavItem[] => {
  const navItems: NavItem[] = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "Projects",
      href: "/projects",
      icon: <FileBarChart size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "Leads & Clients",
      icon: <Users size={18} />,
      industry: ["construction", "real-estate", "general"],
      children: [
        { label: "Leads", href: "/leads", icon: <User size={18} /> },
        { label: "Clients", href: "/clients", icon: <Users size={18} /> },
      ]
    },
    {
      label: "Jobs",
      href: "/jobs",
      icon: <ClipboardList size={18} />,
      industry: ["construction", "general"],
    },
    {
      label: "Schedule",
      href: "/schedule",
      icon: <CalendarCheck size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "Calls",
      icon: <Phone size={18} />,
      industry: ["construction", "real-estate", "general"],
      children: [
        { label: "All Calls", href: "/calls", icon: <Phone size={18} /> },
        { label: "Incoming", href: "/calls/incoming", icon: <Phone size={18} /> },
        { label: "Outgoing", href: "/calls/outgoing", icon: <Phone size={18} /> },
        { label: "Missed", href: "/calls/missed", icon: <Phone size={18} /> },
        { label: "Converted", href: "/calls/converted", icon: <Phone size={18} /> },
      ]
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <ClipboardList size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "Estimates",
      href: "/estimates",
      icon: <FileText size={18} />,
      industry: ["construction", "general"],
    },
    {
      label: "Personnel",
      icon: <Users size={18} />,
      industry: ["construction", "general"],
      children: [
        { label: "All Technicians", href: "/technicians", icon: <Wrench size={18} /> },
        { label: "Contractors", href: "/contractors", icon: <HardHat size={18} /> }, // New item
        { label: "Employed", href: "/employed", icon: <Briefcase size={18} /> },
      ]
    },
    {
      label: "Real Estate",
      icon: <Building2 size={18} />,
      industry: ["real-estate"],
      children: [
        { label: "Properties", href: "/properties", icon: <Home size={18} /> },
        { label: "Listings", href: "/listings", icon: <FileText size={18} /> },
        { label: "Agents", href: "/agents", icon: <Briefcase size={18} /> },
      ]
    },
    {
      label: "Construction",
      icon: <Hammer size={18} />,
      industry: ["construction"],
      children: [
        { 
          label: "Projects", 
          href: "/construction-projects", 
          icon: <HardHat size={18} /> 
        },
        { 
          label: "Equipment", 
          href: "/equipment", 
          icon: <Truck size={18} /> 
        },
        { 
          label: "Materials", 
          href: "/materials", 
          icon: <Package size={18} /> 
        },
        { 
          label: "Contractors", 
          href: "/contractors", 
          icon: <HardHat size={18} /> 
        },
        { 
          label: "Safety Reports", 
          href: "/safety-reports", 
          icon: <ShieldCheck size={18} /> 
        },
        { 
          label: "Inspections", 
          href: "/inspections", 
          icon: <FileSearch size={18} /> 
        }
      ]
    },
    {
      label: "Payments",
      href: "/payments",
      icon: <BadgeDollarSign size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "Finance",
      href: "/finance",
      icon: <Coins size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
    {
      label: "GPS Tracking",
      href: "/gps-tracking",
      icon: <MapPin size={18} />,
      industry: ["construction", "general"],
    },
    {
      label: "Job Sources",
      href: "/job-sources",
      icon: <FileBarChart size={18} />,
      industry: ["construction", "general"],
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={18} />,
      industry: ["construction", "real-estate", "general"],
    },
  ];
  
  // Return all nav items, regardless of industry
  // The service-specific filtering will be handled by the ServiceCategorySelector component
  return navItems;
};

// Create a function to determine if a navigation item should be displayed based on the selected service
export const filterNavItemsByService = (navItems: NavItem[], selectedService: string): NavItem[] => {
  return navItems.filter(item => {
    // If no industry is specified, show for all
    if (!item.industry) return true;
    
    // Show if the item is applicable to the selected industry
    return item.industry.includes(selectedService as "construction" | "real-estate" | "general");
  });
};

// Get all nav items that should be displayed in the current context
export const getDisplayedNavItems = (selectedService: string): NavItem[] => {
  const allNavItems = getIndustrySpecificNavItems();
  return filterNavItemsByService(allNavItems, selectedService);
};
