
import { SalaryBasis, IncentiveType } from './employee';

// Add more type definition if needed
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  specialty: string;
  status: "active" | "inactive" | "onLeave";
  category?: string;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  startDate?: string;
  hireDate: string; // Made this required since it's used throughout the code
  address?: string;
  notes?: string;
  imageUrl?: string;
  paymentType: "percentage" | "flat" | "hourly";
  paymentRate: number;
  
  // Salary-related fields
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
}
