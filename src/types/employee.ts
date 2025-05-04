
export enum EMPLOYEE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  ON_LEAVE = "on_leave",
  CONTRACT = "contract", 
  PROBATION = "probation"
}

export enum RESUME_STATUS {
  NEW = "new",
  REVIEWING = "reviewing",
  INTERVIEW = "interview",
  APPROVED = "approved",
  REJECTED = "rejected",
  HIRED = "hired"
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

export enum DOCUMENT_TYPE {
  ID = "id",
  CONTRACT = "contract",
  CERTIFICATION = "certification",
  LICENSE = "license",
  MEDICAL = "medical",
  TAX = "tax",
  EDUCATION = "education",
  OTHER = "other"
}

export type SalaryBasis = SALARY_BASIS;
export type IncentiveType = INCENTIVE_TYPE;

// Create options arrays for select inputs
export const SALARY_BASIS_OPTIONS = Object.values(SALARY_BASIS);
export const INCENTIVE_TYPE_OPTIONS = Object.values(INCENTIVE_TYPE);
export const EMPLOYEE_STATUS_OPTIONS = Object.values(EMPLOYEE_STATUS);

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  type?: string;
  size?: number;
  uploadedBy?: string;
}

export interface EmployeeDocument extends Document {
  dateUploaded?: string;
  expiryDate?: string;
  notes?: string;
  type?: DOCUMENT_TYPE | string;
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
  documents?: Document[] | EmployeeDocument[];
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
  employeeId?: string;
  dateSubmitted?: string;
  status?: string;
}

// Utility function to get a user-friendly label for document types
export const getDocumentTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    [DOCUMENT_TYPE.ID]: 'Identification',
    [DOCUMENT_TYPE.CONTRACT]: 'Employment Contract',
    [DOCUMENT_TYPE.CERTIFICATION]: 'Certification',
    [DOCUMENT_TYPE.LICENSE]: 'License',
    [DOCUMENT_TYPE.MEDICAL]: 'Medical Record',
    [DOCUMENT_TYPE.TAX]: 'Tax Document',
    [DOCUMENT_TYPE.EDUCATION]: 'Educational Document',
    [DOCUMENT_TYPE.OTHER]: 'Other Document'
  };
  
  return typeMap[type] || 'Document';
};

// Utility function to get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};
