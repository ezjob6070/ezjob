
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "monthly" | "annually" | "commission" | "yearly";

export type StaffRole = "technician" | "salesman";

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
  specialty: string;
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  salaryBasis: SalaryBasis;
  hourlyRate: number;
  incentiveAmount?: number;
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";
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
  contractType?: string;
  certifications?: string[];
  skills?: string[];
  jobCategories?: string[];
  yearsExperience?: number;
  role?: StaffRole;
}
