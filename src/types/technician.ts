
import { SalaryBasis, IncentiveType } from "./employee";

export type Technician = {
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
  specialty: string;
  specialties?: string[]; // Add this as optional for backward compatibility
  paymentType: "percentage" | "flat" | "hourly";
  paymentRate: number;
  hourlyRate: number; // Required field, always a number
  salaryBasis?: SalaryBasis;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  rating?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  notes?: string;
  profileImage?: string;
  imageUrl?: string;
  certifications?: string[];
  skills?: string[];
  category?: string;
  contractType?: string;
  schedule?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  jobCategories?: string[];
  performanceRating?: number;
  initials?: string;
};
