
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
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200",
          currentPath === item.href
            ? "bg-blue-700 text-white"
            : "text-white/80 hover:bg-blue-700 hover:text-white"
        )}
      >
        {item.icon}
        <span>{item.label}</span>
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
            "flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors duration-200",
            (currentPath === "/leads" || currentPath === "/clients")
              ? "bg-blue-700 text-white"
              : "text-white/80 hover:bg-blue-700 hover:text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronUpIcon size={16} />
          ) : (
            <ChevronDownIcon size={16} />
          )}
        </button>
        {isExpanded && (
          <ul className="mt-2 ml-4 space-y-2">
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
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
        currentPath === item.href
          ? "bg-blue-700 text-white"
          : "text-white/80 hover:bg-blue-700 hover:text-white"
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
};

export default NavItem;
