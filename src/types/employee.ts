
export enum SalaryBasis {
  HOURLY = "HOURLY",
  SALARY = "SALARY", 
  COMMISSION = "COMMISSION",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY"
}

export enum IncentiveType {
  BONUS = "BONUS",
  COMMISSION = "COMMISSION",
  PROFIT_SHARING = "PROFIT_SHARING",
  NONE = "NONE",
  HOURLY = "HOURLY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
  CONTRACT = "CONTRACT",
  PROBATION = "PROBATION",
  PENDING = "PENDING" // Added missing status
}

export enum ResumeStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  INTERVIEW = "INTERVIEW",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
  ARCHIVED = "ARCHIVED",
  APPROVED = "APPROVED" // Added missing status
}

export enum DocumentType {
  IDENTIFICATION = "IDENTIFICATION",
  CERTIFICATION = "CERTIFICATION",
  INSURANCE = "INSURANCE",
  CONTRACT = "CONTRACT",
  TAX = "TAX",
  OTHER = "OTHER",
  // Added missing document types
  ID = "ID",
  PASSPORT = "PASSPORT",
  DRIVERS_LICENSE = "DRIVERS_LICENSE",
  WORK_PERMIT = "WORK_PERMIT"
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string; // Keep this for compatibility
  dateHired: Date | string; // Add this for components that need it
  status: EmployeeStatus;
  salary: number;
  salaryBasis: SalaryBasis;
  address?: string;
  photo?: string;
  notes?: EmployeeNote[];
  documents?: EmployeeDocument[];
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  manager?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  skillset?: string[];
  performanceRating?: number;
  // Added missing properties
  skills?: string[];
  profileImage?: string;
  initials?: string;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
  dateOfBirth?: string;
  reportsTo?: string;
  taxPercentage?: number;
  hourlyRate?: number;
  education?: string[];
  certifications?: string[];
  background?: string;
}

export interface EmployeeNote {
  id: string;
  date: string;
  content: string;
  author: string;
  type: string;
  // Added missing properties
  createdAt?: string;
  createdBy?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: DocumentType;
  date: string;
  fileUrl: string;
  expiryDate?: string;
  notes?: string;
  // Added missing properties
  dateUploaded?: Date | string;
  url?: string;
}

export interface Resume {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  position: string;
  submissionDate: string;
  fileUrl: string;
  status: ResumeStatus;
  notes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  // Added missing properties
  name?: string;
  experience?: string;
  resumeUrl?: string;
  dateSubmitted?: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  fileUrl?: string;
  author: string;
  relatedEmployees?: string[];
  // Added missing properties
  employeeId?: string;
  status?: string;
  dateSubmitted?: string;
}

export const SALARY_BASIS_OPTIONS = [
  { value: SalaryBasis.HOURLY, label: "Hourly" },
  { value: SalaryBasis.SALARY, label: "Salary" },
  { value: SalaryBasis.COMMISSION, label: "Commission" },
  { value: SalaryBasis.WEEKLY, label: "Weekly" },
  { value: SalaryBasis.MONTHLY, label: "Monthly" },
  { value: SalaryBasis.YEARLY, label: "Yearly" }
];

export const INCENTIVE_TYPE_OPTIONS = [
  { value: IncentiveType.BONUS, label: "Bonus" },
  { value: IncentiveType.COMMISSION, label: "Commission" },
  { value: IncentiveType.PROFIT_SHARING, label: "Profit Sharing" },
  { value: IncentiveType.NONE, label: "None" },
  { value: IncentiveType.HOURLY, label: "Hourly" },
  { value: IncentiveType.WEEKLY, label: "Weekly" },
  { value: IncentiveType.MONTHLY, label: "Monthly" }
];

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: EmployeeStatus.ACTIVE, label: "Active" },
  { value: EmployeeStatus.INACTIVE, label: "Inactive" },
  { value: EmployeeStatus.ON_LEAVE, label: "On Leave" },
  { value: EmployeeStatus.TERMINATED, label: "Terminated" },
  { value: EmployeeStatus.CONTRACT, label: "Contract" },
  { value: EmployeeStatus.PROBATION, label: "Probation" },
  { value: EmployeeStatus.PENDING, label: "Pending" }
];
