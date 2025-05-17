
export type SalaryBasis = "hourly" | "weekly" | "biweekly" | "monthly" | "yearly" | "per-project";

export type TechnicianStatus = "active" | "inactive" | "on_leave" | "training";

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
  profileImage?: string;
  imageUrl?: string;
  status: TechnicianStatus;
  specialty?: string;
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  hourlyRate: number;
  salaryBasis: SalaryBasis;
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";
  incentiveAmount?: number;
  notes?: string;
  terminationDate?: string;
  birthday?: string;
  employeeId?: string;
  
  // Add fields that were missing but referenced in code
  initials?: string;
  role?: "technician" | "salesman" | "employed" | "contractor";
  subRole?: string;
  ssn?: string;
  driverLicense?: {
    number: string;
    state: string;
    expirationDate: string;
  } | string;
  idNumber?: string;
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  title?: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface TechnicianTableProps {
  technicians: Technician[];
  onSelectTechnician: (technician: Technician) => void;
  selectedFilter?: string;
}
