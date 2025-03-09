
import { BarChart3, Users, FileText, CreditCard } from "lucide-react";

export const financeTabOptions = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "jobSources", label: "Job Sources", icon: <FileText className="h-5 w-5" /> },
  { id: "technicians", label: "Technicians", icon: <Users className="h-5 w-5" /> },
  { id: "transactions", label: "Transactions", icon: <CreditCard className="h-5 w-5" /> },
];

export type FinanceTabId = "overview" | "jobSources" | "technicians" | "transactions";
