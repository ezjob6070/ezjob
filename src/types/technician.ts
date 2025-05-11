export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";

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
  role?: string; // Contractor, employee, etc.
  subRole?: string; // Specific role within the main role
  specialty?: string; // Technical specialty
  
  // Payment related fields
  paymentType?: "percentage" | "flat" | "hourly" | "salary";
  paymentRate?: number;
  hourlyRate?: number;
  salaryBasis?: SalaryBasis;
  
  // Document related fields
  ssn?: string;
  driverLicense?: string | { number: string; state: string; expirationDate: string };
  idNumber?: string;
  documents?: any[]; // Allow documents array
  initials?: string;
  
  // Additional fields for finance components
  incentiveType?: string;
  incentiveAmount?: number;
  
  // Other fields that might be needed
  category?: string;
}
