
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "yearly" | "per-project" | "commission" | "annually";

export type TechnicianStatus = "active" | "inactive" | "on_leave" | "onLeave" | "training";

export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

// Define sub-roles for each technician role
export interface TechnicianSubRoles {
  technician: string[];
  salesman: string[];
  employed: string[];
  contractor: string[];
}

// Default sub-roles for each technician role
export const DEFAULT_SUB_ROLES: TechnicianSubRoles = {
  technician: [
    "HVAC Specialist", 
    "Plumber", 
    "Electrician", 
    "General Technician", 
    "Solar Technician",
    "Integration Specialist"
  ],
  salesman: [
    "Inside Sales", 
    "Field Sales", 
    "Lead Generator", 
    "Sales Manager"
  ],
  employed: [
    "Management", 
    "Office Staff", 
    "Support", 
    "HR",
    "Customer Service"
  ],
  contractor: [
    "Lighting Designer",
    "Project Manager",
    "Specialist",
    "Consultant"
  ]
};

export interface Document {
  id: string;
  name: string;
  title?: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

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
  payRate?: number;
  
  // Add these fields that were missing but referenced in various components
  initials?: string;
  role?: TechnicianRole;
  subRole?: string;
  ssn?: string;
  driverLicense?: {
    number: string;
    state: string;
    expirationDate: string;
  } | string;
  idNumber?: string;
  documents?: Document[];
  category?: string;
  workContract?: string;
  profit?: number;
  skills?: string[];
  certifications?: string[];
  yearsExperience?: number;
}

export interface TechnicianTableProps {
  technicians: Technician[];
  onSelectTechnician: (technician: Technician) => void;
  selectedFilter?: string;
}
