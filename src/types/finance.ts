
import { DateRange } from "react-day-picker";
import { Technician } from './technician';

export type TransactionType = "income" | "expense" | "refund" | "payment";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded" | "cancelled";

export type TransactionCategory = 
  | "job_payment" 
  | "materials" 
  | "equipment" 
  | "salary" 
  | "technician_payment"
  | "contractor_payment"
  | "office"
  | "marketing"
  | "utilities"
  | "rent"
  | "fuel"
  | "vehicle"
  | "insurance"
  | "other";

export type TimeFrame = "day" | "week" | "month" | "year" | "custom";

export type DateFilterType = "today" | "week" | "month" | "year" | "custom";

export interface FinancialFilters {
  dateRange: DateRange | null;
  technicians: string[];
  jobSources: string[];
  categories: string[];
  searchTerm: string;
}

export interface FinancialTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  status: PaymentStatus;
  reference?: string;
  jobId?: string;
  technicianId?: string;
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  jobSourceId?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt?: Date;
  clientName?: string;
  jobTitle?: string;
  quoteStatus?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  color: string;
  budget?: number;
  currentSpend?: number;
  amount: number;
  percentage: number;
}

export interface FinancialReport {
  timeFrame: TimeFrame;
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  companyProfit: number;
  technicianPayments: number;
  transactions: FinancialTransaction[];
}

// Define the JobSource interface
export interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType?: string;
  paymentValue?: number;
  isActive?: boolean;
  totalJobs?: number;
  totalRevenue: number;
  expenses: number;
  companyProfit: number;
  createdAt?: string;
  category?: string;
  website?: string;
}

export interface OfficeExpense {
  id: string;
  date: Date | string;
  category: string;
  description: string;
  amount: number;
  vendor: string;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  recurring?: boolean;
  receipt?: string;
}

export interface SearchBarProps {
  searchTerm: string;
  updateFilter?: <K extends keyof FinancialFilters>(key: K, value: FinancialFilters[K]) => void;
  hidden?: boolean;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onChange?: (value: any) => void;
  showIcons?: boolean;
}

// Align ProjectStaff with project.ts definition - using the proper status type
export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
  hourlyRate?: number;
  totalHours?: number;
  totalCost?: number;
  startDate: string;
  status: "active" | "completed" | "terminated";
  endDate?: string;
  notes?: string;
  specialty?: string;
  assignedTasks?: string[];
  email?: string;
  phone?: string;
}
