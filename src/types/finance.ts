import { JobSource } from "./jobSource";

export interface FinancialTransaction {
  id: string;
  date: Date;
  amount: number;
  category: "payment" | "expense" | "refund";
  description: string;
  status: "pending" | "completed" | "cancelled";
  clientName?: string;
  jobId?: string;
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  notes?: string;
  jobTitle?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  quoteStatus?: "pending" | "accepted" | "rejected" | "completed";
}

export interface FinancialReport {
  timeFrame: "day" | "week" | "month" | "year" | "custom";
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  companyProfit: number;
  technicianPayments: number;
  transactions: FinancialTransaction[];
}

// Export the JobSource type
export type { JobSource } from './jobSource';

export interface JobSourceFinance extends JobSource {
  // Extending the JobSource type to ensure compatibility
  type: string;
}

export interface FinancePage {
  activeTab: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Add types for other finance features
export type TimeFrame = "day" | "week" | "month" | "year" | "custom";

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  amount?: number;
  percentage?: number;
  icon?: React.ReactNode;
  budget?: number;
  currentSpend?: number;
}

export interface OfficeExpense {
  id: string;
  name?: string;
  amount: number;
  date: Date | string;
  category: string;
  description?: string;
  recurring?: boolean;
  paidBy?: string;
  vendor?: string;
  paymentMethod?: string;
  status?: string;
  receipt?: string;
}

export type FinanceEntityType = "technician" | "jobSource" | "contractor" | "employee" | "salesman";

// User management types with enhanced permissions
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: Date;
  status: "active" | "inactive" | "pending";
  permissions: UserPermission[];
  createdAt: Date;
}

export type UserRole = "admin" | "manager" | "staff" | "viewer";

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  module: PermissionModule;
  action: PermissionAction;
  // Add visibility control and data access level
  visibilityLevel?: VisibilityLevel;
  dataAccessLevel?: DataAccessLevel;
}

export type PermissionModule = "jobs" | "technicians" | "clients" | "finance" | "settings" | "reports" | "team" | "payments" | "estimates" | "invoices";
export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "manage" | "export" | "import" | "viewSensitive";

// New types for enhanced granular permissions
export type VisibilityLevel = "none" | "limited" | "standard" | "full";
export type DataAccessLevel = "none" | "personal" | "team" | "department" | "all";

// Feature access control
export interface FeatureAccess {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
}

// Company profile settings
export interface CompanyProfile {
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  logo?: string;
  industry?: string;
  taxId?: string;
  description?: string;
}

export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hourlyRate?: number;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "terminated";
  notes?: string;
  specialty?: string;
  assignedTasks?: string[];
}
