export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";

export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

// Default sub-roles for each technician role
export const DEFAULT_SUB_ROLES: Record<TechnicianRole, string[]> = {
  technician: ["HVAC", "Plumbing", "Electrical", "Carpentry", "General"],
  salesman: ["Inside Sales", "Outside Sales", "Account Manager", "Sales Manager"],
  employed: ["Office Staff", "Manager", "Customer Service", "Administrative"],
  contractor: ["Independent", "1099", "Specialist", "Consultant"]
};

// User permission types
export type UserPermission = "admin" | "manager" | "standard" | "limited";

// Permission descriptions
export const PERMISSION_DESCRIPTIONS: Record<UserPermission, string> = {
  admin: "Full access to all system features and data",
  manager: "Access to most features and all data",
  standard: "Access to assigned features and relevant data",
  limited: "Access only to own jobs and limited features"
};

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string;
  startDate?: string;
  status: "active" | "inactive" | "onLeave";
  
  // Role related fields
  role?: TechnicianRole; // Contractor, employee, etc.
  subRole?: string; // Specific role within the main role
  specialty?: string; // Technical specialty
  
  // Payment related fields
  paymentType?: "percentage" | "flat" | "hourly" | "salary";
  paymentRate?: number;
  hourlyRate?: number;
  salaryBasis?: SalaryBasis;
  
  // Document related fields
  ssn?: string;
  driverLicense?: string | { number: string; state: string; expirationDate: string };
  idNumber?: string;
  documents?: any[]; // Allow documents array
  initials?: string;
  
  // Additional fields for finance components
  incentiveType?: string;
  incentiveAmount?: number;
  
  // Performance metrics fields
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
  
  // Permission related fields
  userPermission?: UserPermission;
  canViewOwnJobsOnly?: boolean;
  
  // Other fields that might be needed
  category?: string;
  notes?: string;
}
