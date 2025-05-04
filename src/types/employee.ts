
export enum EMPLOYEE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending"
}

export enum RESUME_STATUS {
  NEW = "new",
  REVIEWING = "reviewing",
  INTERVIEW = "interview",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum SALARY_BASIS {
  HOURLY = "hourly",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ANNUAL = "annual",
  COMMISSION = "commission"
}

export enum INCENTIVE_TYPE {
  HOURLY = "hourly",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  BONUS = "bonus",
  COMMISSION = "commission",
  NONE = "none"
}

export type SalaryBasis = typeof SALARY_BASIS[keyof typeof SALARY_BASIS];
export type IncentiveType = typeof INCENTIVE_TYPE[keyof typeof INCENTIVE_TYPE];

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  type?: string;
  size?: number;
  uploadedBy?: string;
}

export interface EmployeeNote {
  id: string;
  content: string;
  date: string;
  author: string;
  createdAt?: string;
  createdBy?: string;
}

export interface EmergencyContact {
  name: string;
  relation?: string;
  relationship?: string;
  phone: string;
}

export interface SalaryHistory {
  id: string;
  amount: number;
  date: string;
  notes?: string;
  type: 'regular' | 'bonus' | 'commission' | 'raise';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  hireDate: string;
  dateHired?: string;
  status: string;
  salary: number;
  salaryBasis?: SalaryBasis;
  manager: string;
  emergencyContact?: EmergencyContact;
  documents?: Document[];
  notes?: EmployeeNote[];
  profileImage?: string;
  initials?: string;
  address?: string;
  dateOfBirth?: string;
  taxPercentage?: number;
  hourlyRate?: number;
  skills?: string[];
  certifications?: string[];
  education?: string[] | string;
  background?: string;
  performanceRating?: number;
  reportsTo?: string;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  salaryHistory?: SalaryHistory[];
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  status: string;
  submittedDate: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  notes?: string;
  dateSubmitted: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  author: string;
  department: string;
  date: string;
  documentUrl: string;
  shared: string[];
}
