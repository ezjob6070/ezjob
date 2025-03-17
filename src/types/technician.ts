
import { SalaryBasis, IncentiveType } from './employee';

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
  hireDate: string; // Required field
  address?: string;
  notes?: string;
  imageUrl?: string;
  paymentType: "percentage" | "flat" | "hourly";
  paymentRate: number; // Must be number type
  
  // Salary-related fields matching employee functionality
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  department?: string;
  position?: string;
  contractType?: string;
  skills?: string[];
  dateOfBirth?: string;
  emergencyContact?: string;
  education?: string[];
  certifications?: string[];
  performanceRating?: number;
}
