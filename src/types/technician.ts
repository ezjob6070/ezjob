
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
  status: "active" | "inactive" | "onLeave";
  specialty?: string;
  notes?: string;
  salary?: number;
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  hourlyRate?: number;
  payRate?: number;
  employmentType?: string;
  category?: string;
  totalRevenue?: number;
  
  // Additional properties
  role?: "technician" | "salesman" | "employed" | "contractor";
  subRole?: string;
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";
  incentiveAmount?: number;
  salaryBasis?: "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "annually" | "commission" | "yearly";
  documents?: any[];
  workContract?: string;
  initials?: string;
  completedJobs?: number;
  cancelledJobs?: number;
  earnings?: number;
  jobCount?: number;
  rating?: number;
  imageUrl?: string;
  profileImage?: string;
  ssn?: string;
  driverLicense?: any;
  idNumber?: string;
}

// Add additional types needed by components
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "annually" | "commission" | "yearly";
export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

export interface TechnicianSubRoles {
  [key: string]: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export const DEFAULT_SUB_ROLES: TechnicianSubRoles = {
  technician: ["HVAC Technician", "Plumbing Technician", "Electrical Technician", "General Technician"],
  salesman: ["Field Sales", "Office Sales", "Lead Generator", "Account Manager"],
  employed: ["Office Manager", "Admin Assistant", "Accountant", "Customer Service"],
  contractor: ["External Contractor", "Independent Technician", "Specialist", "Consultant"]
};
