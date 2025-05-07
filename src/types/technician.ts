
export type TechnicianStatus = "active" | "inactive" | "onLeave";

export type PaymentType = "percentage" | "flat" | "hourly" | "salary";

export type SalaryBasis = "weekly" | "biweekly" | "monthly" | "yearly";

export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  status: TechnicianStatus;
  hireDate: string;
  specialty: string;
  rating: number;
  bio?: string;
  skills?: string[];
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue?: number;
  imageUrl?: string;
  paymentType: PaymentType;
  paymentRate: number;
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveAmount?: number;
  category?: string;
  role: TechnicianRole;
  initials: string;
  profileImage?: string;
  isActive?: boolean;
}
