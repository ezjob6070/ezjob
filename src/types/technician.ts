
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
  payRate?: number;
  paymentType?: "percentage" | "flat" | "hourly" | "salary";
  salaryBasis?: "hourly" | "weekly" | "bi-weekly" | "biweekly" | "monthly" | "commission" | "annually" | "yearly";
  monthlySalary?: number;
  rating?: number;
  imageUrl?: string;
  skills?: string[];
  certifications?: string[];
  notes?: string;
  category?: string;
  
  // Adding missing properties
  role?: string;
  subRole?: string;
  initials?: string;
  ssn?: string;
  driverLicense?: string;
  idNumber?: string;
  documents?: any[];
}
