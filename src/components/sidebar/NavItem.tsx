
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItemProps, SubNavItemProps } from "./sidebarTypes";

// SubNavItem component for child navigation items
export const SubNavItem = ({ item, currentPath }: SubNavItemProps) => {
  return (
    <li key={item.href}>
      <Link
        to={item.href!}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
          currentPath === item.href
            ? "bg-blue-600 text-white shadow-sm"
            : "text-white/80 hover:bg-blue-600 hover:text-white"
        )}
      >
        {item.icon}
        <span className="text-sm">{item.label}</span>
      </Link>
    </li>
  );
};

// Main NavItem component
const NavItem = ({ item, isExpanded, onToggleExpand, currentPath }: NavItemProps) => {
  // If the item has children, render as expandable section
  if (item.children) {
    return (
      <div>
        <button
          onClick={onToggleExpand}
          className={cn(
            "flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-200",
            (item.children.some(child => currentPath === child.href))
              ? "bg-blue-600 text-white shadow-sm"
              : "text-white/80 hover:bg-blue-600 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronUpIcon size={16} className="opacity-70" />
          ) : (
            <ChevronDownIcon size={16} className="opacity-70" />
          )}
        </button>
        {isExpanded && (
          <ul className="mt-1.5 ml-3 space-y-1">
            {item.children.map((child) => (
              <SubNavItem key={child.href} item={child} currentPath={currentPath} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Otherwise, render as a simple link
  return (
    <Link
      to={item.href!}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
        currentPath === item.href
          ? "bg-blue-600 text-white shadow-sm"
          : "text-white/80 hover:bg-blue-600 hover:text-white"
      )}
    >
      {item.icon}
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  );
};

export default NavItem;
