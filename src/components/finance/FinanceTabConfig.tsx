
import { BarChart3, Building, Home, Users, CreditCard, ChartBar, ArrowUpDown } from "lucide-react";

export const financeTabOptions = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "properties", label: "Properties", icon: <Home className="h-5 w-5" /> },
  { id: "agents", label: "Agents", icon: <Users className="h-5 w-5" /> },
  { id: "transactions", label: "Transactions", icon: <CreditCard className="h-5 w-5" /> },
];

export type FinanceTabId = "overview" | "properties" | "agents" | "transactions";

// Sort options for various sections
export const sortOptions = [
  { id: "newest", label: "Newest First", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "oldest", label: "Oldest First", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "highestRevenue", label: "Highest Revenue", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "lowestRevenue", label: "Lowest Revenue", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "nameAZ", label: "Name (A-Z)", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "nameZA", label: "Name (Z-A)", icon: <ArrowUpDown className="h-4 w-4" /> },
];
