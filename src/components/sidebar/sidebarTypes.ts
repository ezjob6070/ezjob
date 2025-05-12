
import { ReactNode } from "react";

export type IndustryType = "construction" | "real-estate" | "general";

export interface NavItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  industry?: IndustryType[];
  children?: NavItem[];
}
