
// Define document types
export interface Document {
  id: string;
  name: string;
  title: string;
  type: string;
  size?: number;
  uploadDate: string;
  url: string;
}

// Define types for payment handling
export type PaymentType = "percentage" | "flat" | "hourly" | "salary";
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";
export type IncentiveType = "none" | "bonus" | "commission" | "profit-sharing" | "other";
export type TechnicianStatus = "active" | "inactive" | "onLeave";

export interface TechnicianSubRoles {
  technician: string[];
  salesman: string[];
  employed: string[];
  contractor: string[];
}

export const DEFAULT_SUB_ROLES: TechnicianSubRoles = {
  technician: ["HVAC", "Plumbing", "Electrical", "General"],
  salesman: ["Field Agent", "Inside Sales", "Account Manager", "Consultant"],
  employed: ["Office Staff", "Manager", "Customer Service", "Administrator"],
  contractor: ["Specialist", "On-Call", "Regular", "Project-based"]
};

export interface DriverLicense {
  number: string;
  state: string;
  expirationDate: string;
}

// Main Technician interface
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
  endDate?: string;
  status: TechnicianStatus;
  paymentType: PaymentType;
  paymentRate: number;
  hourlyRate: number;
  specialty: string;
  subRole?: string;
  rating: number;
  availability?: string[];
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  profileImage?: string;
  imageUrl?: string;
  initials?: string;
  salaryBasis?: SalaryBasis;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  
  // Add properties referenced in the errors
  role?: string;
  earnings?: number;
  jobCount?: number;
  technicianId?: string;
  date?: string;
  
  // Document handling
  documents?: Document[];
  notes?: string;
  ssn?: string;
  idNumber?: string;
  driverLicense?: DriverLicense | string;
  
  // Skills and certifications referenced in the errors
  skills?: string[];
  certifications?: string[];
  jobCategories?: string[];
}

// Job interface - minimal version to resolve errors
export interface Job {
  id: string;
  title: string;
  status: string;
  scheduledDate?: string;
  date?: string;
  amount: number;
  actualAmount?: number;
  technicianId?: string;
  description?: string;
}
