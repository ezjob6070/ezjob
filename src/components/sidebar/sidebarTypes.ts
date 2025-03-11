
import { INDUSTRY_TYPES } from "./sidebarConstants";

export type IndustryType = typeof INDUSTRY_TYPES[number];

export type NavItem = {
  label: string;
  icon: JSX.Element;
  href?: string;
  children?: NavItem[];
  industries?: string[]; // Only show for specific industries
};

export type SidebarProps = {
  isOpen: boolean;
  isMobile: boolean;
};

export type NavItemProps = {
  item: NavItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  currentPath: string;
};

export type SubNavItemProps = {
  item: NavItem;
  currentPath: string;
};
