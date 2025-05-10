
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
  startDate?: string;
  status: "active" | "inactive" | "onLeave";
  hireDate: string;
  specialty: string;
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  hourlyRate: number;
  salaryBasis: SalaryBasis;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  notes?: string;
  profileImage?: string;
  imageUrl?: string;
  certifications?: string[];
  skills?: string[];
  yearsExperience?: number;
  documents?: Document[];
  category?: string;
  role?: TechnicianRole;
  subRole?: string;
  initials: string;
  jobCategories?: string[];
  // Sensitive information fields
  ssn?: string;
  driverLicense?: {
    number: string;
    state: string;
    expirationDate: string;
  };
  idNumber?: string;
  workContract?: string;
  // Additional properties required by other components
  isActive?: boolean;
  contractorId?: string;
  contractorName?: string;
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
