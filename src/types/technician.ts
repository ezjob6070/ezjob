
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialty?: string;
  status: "active" | "inactive" | "onLeave";
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  hourlyRate: number;
  hireDate: string;
  startDate?: string;
  notes?: string;
  department?: string;
  position?: string;
  salaryBasis: "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "annually" | "commission" | "yearly";
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  category?: string;
  certifications?: string[];
  skills?: string[];
  imageUrl?: string;
  yearsExperience?: number;
  initials: string;
  contractType?: string;
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";
  incentiveAmount?: number;
  profileImage?: string;
  // Required fields that were missing
  role: "technician" | "salesman" | "employed" | "contractor";
  subRole?: string;
  // Sensitive information
  ssn?: string;
  driverLicense?: string | {
    number: string;
    state: string;
    expirationDate: string;
  };
  idNumber?: string;
  workContract?: string;
  // Document management
  documents?: Document[];
}

export interface Document {
  id: string;
  name?: string; // Making name optional since it was missing in several places
  title: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface TechnicianSubRoles {
  technician: string[];
  salesman: string[];
  employed: string[];
  contractor: string[];
}

// Default sub-roles for technicians
export const DEFAULT_SUB_ROLES: TechnicianSubRoles = {
  technician: ["HVAC", "Electrical", "Plumbing", "Carpentry", "General"],
  salesman: ["Inside Sales", "Outside Sales", "Account Manager", "Lead Generator"],
  employed: ["Administration", "Finance", "HR", "Operations", "Management"],
  contractor: ["Independent", "Specialized", "Consultant", "Agency"]
};
