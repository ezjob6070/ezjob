
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
  PROBATION = "PROBATION"
}

export enum ResumeStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  INTERVIEW = "INTERVIEW",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
  ARCHIVED = "ARCHIVED"
}

export enum DocumentType {
  IDENTIFICATION = "IDENTIFICATION",
  CERTIFICATION = "CERTIFICATION",
  INSURANCE = "INSURANCE",
  CONTRACT = "CONTRACT",
  TAX = "TAX",
  OTHER = "OTHER"
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
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
}

export interface EmployeeNote {
  id: string;
  date: string;
  content: string;
  author: string;
  type: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: DocumentType;
  date: string;
  fileUrl: string;
  expiryDate?: string;
  notes?: string;
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
  { value: EmployeeStatus.PROBATION, label: "Probation" }
];
