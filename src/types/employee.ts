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
  RESUME = "resume",
  PASSPORT = "passport",
  DRIVERS_LICENSE = "drivers_license",
  WORK_PERMIT = "work_permit",
  OTHER = "other"
}

export type SalaryBasis = SALARY_BASIS;
export type IncentiveType = "hourly" | "weekly" | "monthly" | "bonus" | "commission" | "none";

// Create options arrays for select inputs
export const SALARY_BASIS_OPTIONS = Object.values(SALARY_BASIS);
export const INCENTIVE_TYPE_OPTIONS = Object.values(INCENTIVE_TYPE);
export const EMPLOYEE_STATUS_OPTIONS = Object.values(EMPLOYEE_STATUS);

// For form select components compatibility
export const SALARY_BASIS_SELECT_OPTIONS = SALARY_BASIS_OPTIONS.map(basis => ({
  value: basis,
  label: basis.charAt(0).toUpperCase() + basis.slice(1).replace('_', ' ')
}));

export const INCENTIVE_TYPE_SELECT_OPTIONS = INCENTIVE_TYPE_OPTIONS.map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
}));

export const EMPLOYEE_STATUS_SELECT_OPTIONS = EMPLOYEE_STATUS_OPTIONS.map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}));

export const DOCUMENT_TYPE_OPTIONS = Object.values(DOCUMENT_TYPE);

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

export interface PerformanceMetric {
  id: string;
  metricName: string;
  value: number;
  maxValue: number;
  date: string;
  notes?: string;
}

export interface EmployeeProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  description?: string;
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
  status: EMPLOYEE_STATUS | string;
  salary: number;
  salaryBasis?: SALARY_BASIS;
  manager: string;
  emergencyContact?: EmergencyContact;
  documents?: EmployeeDocument[] | Document[];
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
  incentiveType?: INCENTIVE_TYPE;
  incentiveAmount?: number;
  salaryHistory?: SalaryHistory[];
  performanceMetrics?: PerformanceMetric[];
  projects?: EmployeeProject[];
  completedProjects?: number;
  activeProjects?: number;
  totalHoursLogged?: number;
  attendanceRate?: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  yearsOfExperience?: number;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  status: RESUME_STATUS | string;
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
    [DOCUMENT_TYPE.RESUME]: 'Resume',
    [DOCUMENT_TYPE.PASSPORT]: 'Passport',
    [DOCUMENT_TYPE.DRIVERS_LICENSE]: 'Driver\'s License',
    [DOCUMENT_TYPE.WORK_PERMIT]: 'Work Permit',
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
