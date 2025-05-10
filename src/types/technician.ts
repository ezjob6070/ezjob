
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";

export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

export type IncentiveType = "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";

export interface TechnicianSubRoles {
  technician: string[];
  salesman: string[];
  employed: string[];
  contractor: string[];
}

export const DEFAULT_SUB_ROLES: TechnicianSubRoles = {
  technician: ["HVAC", "Plumbing", "Electrical", "General", "Carpentry"],
  salesman: ["Inside Sales", "Outside Sales", "Account Manager", "Sales Support"],
  employed: ["Secretary", "Management", "HR", "Finance", "Administration", "Operations"],
  contractor: ["Independent", "Agency", "Specialized", "Consultant"]
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
  payRate?: number;
  paymentType?: "percentage" | "flat" | "hourly" | "salary";
  salaryBasis?: SalaryBasis;
  monthlySalary?: number;
  rating?: number;
  imageUrl?: string;
  skills?: string[];
  certifications?: string[];
  notes?: string;
  category?: string;
  specialty?: string;
  
  // Added required properties based on the errors
  role?: TechnicianRole;
  subRole?: string;
  initials?: string;
  ssn?: string;
  driverLicense?: string | { number: string; state: string; expirationDate: string; };
  idNumber?: string;
  documents?: any[];
  profileImage?: string;
  yearsExperience?: number;
  workContract?: string;
  jobCategories?: string[];
  
  // Finance and performance related properties
  paymentRate?: number;
  hourlyRate?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  url: string;
  uploadDate: string;
  size?: number;
}

export interface TechnicianFilters {
  search: string;
  paymentTypes: string[];
  status: string[];
  categories: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface FinancialSummary {
  totalRevenue: number;
  totalJobs: number;
  averageJobValue: number;
  paymentsDue: number;
}
