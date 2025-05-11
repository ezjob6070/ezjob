
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";

export type TechnicianRole = "technician" | "salesman" | "employed" | "contractor";

// Define incentive types
export type IncentiveType = "none" | "bonus" | "commission" | "hourly" | "weekly" | "monthly";

// Default sub-roles for each technician role
export const DEFAULT_SUB_ROLES: Record<TechnicianRole, string[]> = {
  technician: ["HVAC", "Plumbing", "Electrical", "Carpentry", "General"],
  salesman: ["Inside Sales", "Outside Sales", "Account Manager", "Sales Manager"],
  employed: ["Office Staff", "Manager", "Customer Service", "Administrative"],
  contractor: ["Jobs Contractor", "General Contractor", "Electrical Contractor", "Plumbing Contractor", "HVAC Contractor", "Specialty Contractor", "Independent", "1099", "Specialist", "Consultant"]
};

// Define Document type
export interface Document {
  id: string;
  name: string;
  type: string;
  url?: string;
  uploadDate: string;
  expirationDate?: string;
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
  status: "active" | "inactive" | "onLeave";
  
  // Required properties being added/fixed
  role?: TechnicianRole; // Contractor, employee, etc.
  subRole?: string; // Specific role within the main role
  specialty: string; // Technical specialty - make required
  
  // Payment related fields
  paymentType?: "percentage" | "flat" | "hourly" | "salary";
  paymentRate?: number;
  hourlyRate?: number;
  salaryBasis?: SalaryBasis;
  
  // Document related fields
  ssn?: string;
  driverLicense?: string | { number: string; state: string; expirationDate: string };
  idNumber?: string;
  documents?: Document[]; // Define documents array with the Document interface
  initials?: string;
  
  // Additional fields for finance components
  incentiveType?: IncentiveType; // Use strict IncentiveType
  incentiveAmount?: number;
  
  // Performance metrics fields
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
  
  // Other fields that might be needed
  category?: string;
  certifications?: string[];
  skills?: string[];
  imageUrl?: string;
  profileImage?: string;
  yearsExperience?: number;
  workContract?: string;
  
  // Notes for technicians
  notes?: string;
}
