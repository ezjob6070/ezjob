import React from "react";
import {
  LayoutDashboard,
  List,
  User2,
  Settings,
  Calendar,
  FileText,
  Image,
  MapPin,
  Users,
  Truck,
  DollarSign,
  ListTodo
} from "lucide-react";

import { NavItem } from "@/types";

interface SidebarProps {
  isSuperAdmin?: boolean;
}

export const Sidebar = ({ isSuperAdmin }: SidebarProps) => {
  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <List className="h-5 w-5" />,
    },
    {
      title: "Tasks & Progress",
      href: "/tasks",
      icon: <ListTodo className="h-5 w-5" />
    },
    {
      title: "Clients",
      href: "/clients",
      icon: <User2 className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const superAdminNavigationItems: NavItem[] = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r py-4">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">ProjectOS</h1>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navigationItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200"
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </a>
        ))}
      </nav>
      {isSuperAdmin && (
        <>
          <div className="px-4 mt-4 mb-2">
            <h2 className="text-sm font-semibold">Admin Panel</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {superAdminNavigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200"
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </a>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};
