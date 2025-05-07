
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";

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
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";
  incentiveAmount?: number;
  notes?: string;
  profileImage?: string;
  imageUrl?: string;
  certifications?: string[];
  skills?: string[];
  yearsExperience?: number;
  documents?: Document[];
  category?: string;
  role?: "technician" | "salesman" | "employed" | "contractor";
  initials: string;
  jobCategories?: string[];
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
