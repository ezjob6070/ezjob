
// src/types/technician.ts
import { SalaryBasis, IncentiveType } from './employee';

// Add more type definition if needed
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  specialty: string;
  status: "active" | "inactive";
  category?: string;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  startDate?: string;
  address?: string;
  notes?: string;
  imageUrl?: string;
  paymentType: "percentage" | "flat";
  paymentRate: number;
  
  // Salary-related fields
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
}
