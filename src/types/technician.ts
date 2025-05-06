
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "monthly" | "annually";
export type IncentiveType = "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  status: "active" | "inactive" | "onLeave" | "suspended" | "terminated";
  specialty: string;
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  salaryBasis?: SalaryBasis;
  hourlyRate: number;
  incentiveAmount?: number;
  incentiveType?: IncentiveType;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  profileImage?: string;
  imageUrl?: string;
  initials: string;
  hireDate: string;
  notes?: string;
  category?: string;
  // Previously missing properties now included
  certifications?: string[];
  skills?: string[];
  jobCategories?: string[];
  contractType?: string;
  yearsExperience?: number;
}
