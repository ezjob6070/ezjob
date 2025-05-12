
import { BarChart3, Users, FileText, CreditCard, Building, BadgeDollarSign, ArrowUpDown, Wrench, UserCircle, Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const financeTabOptions = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "jobSources", label: "Job Sources", icon: <FileText className="h-5 w-5" /> },
  { id: "technicians", label: "Technicians", icon: <Users className="h-5 w-5" /> },
  { id: "contractors", label: "Contractors", icon: <Wrench className="h-5 w-5" /> },
  { id: "employees", label: "Employees", icon: <UserCircle className="h-5 w-5" /> },
  { id: "salesmen", label: "Salesmen", icon: <Briefcase className="h-5 w-5" /> },
  { id: "transactions", label: "Transactions", icon: <CreditCard className="h-5 w-5" /> },
  { id: "salaries", label: "Salaries", icon: <BadgeDollarSign className="h-5 w-5" /> },
  { id: "office", label: "Office & Others", icon: <Building className="h-5 w-5" /> },
];

export type FinanceTabId = "overview" | "jobSources" | "technicians" | "contractors" | "employees" | "salesmen" | "transactions" | "salaries" | "office";

// Quote tab options
export const quoteTabOptions = [
  { id: "all", label: "All Quotes", color: "bg-gray-100 text-gray-800", variant: "default", icon: <FileText className="h-4 w-4" /> },
  { id: "pending", label: "Pending", color: "bg-blue-100 text-blue-800", variant: "blue", icon: <Clock className="h-4 w-4" /> },
  { id: "completed", label: "Completed", color: "bg-green-100 text-green-800", variant: "amber", icon: <CheckCircle className="h-4 w-4" /> },
  { id: "overdue", label: "Overdue", color: "bg-red-100 text-red-800", variant: "red", icon: <AlertTriangle className="h-4 w-4" /> }
];

export type QuoteTabId = "all" | "pending" | "completed" | "overdue";

// Sort options for various sections
export const sortOptions = [
  { id: "newest", label: "Newest First", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "oldest", label: "Oldest First", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "highestRevenue", label: "Highest Revenue", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "lowestRevenue", label: "Lowest Revenue", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "nameAZ", label: "Name (A-Z)", icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: "nameZA", label: "Name (Z-A)", icon: <ArrowUpDown className="h-4 w-4" /> },
];
