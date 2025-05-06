
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "monthly" | "annually";
export type IncentiveType = "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";

// Add enums that are referenced in components
export enum EMPLOYEE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "onLeave",
  SUSPENDED = "suspended",
  TERMINATED = "terminated"
}

export enum RESUME_STATUS {
  NEW = "new",
  REVIEWING = "reviewing",
  INTERVIEW = "interview",
  HIRED = "hired",
  REJECTED = "rejected"
}

export enum SALARY_BASIS {
  HOURLY = "hourly",
  WEEKLY = "weekly",
  BI_WEEKLY = "bi-weekly",
  MONTHLY = "monthly",
  ANNUAL = "annually"
}

export enum INCENTIVE_TYPE {
  BONUS = "bonus",
  COMMISSION = "commission",
  NONE = "none",
  HOURLY = "hourly",
  WEEKLY = "weekly",
  MONTHLY = "monthly"
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
  type?: string;
  size?: number;
  uploadedBy?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  description?: string;
}

export interface EmployeeProject {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  status: "active" | "inactive" | "onLeave" | "suspended" | "terminated";
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  hireDate: string;
  // Additional fields used in components
  location?: string;
  salary?: number;
  manager?: string;
  performanceRating?: number;
  background?: string;
  dateHired?: string; // Alternative field name used in some components
  profileImage?: string;
  emergencyContact?: EmergencyContact;
  attendanceRate?: number;
  completedProjects?: number;
  activeProjects?: number;
  totalHoursLogged?: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  notes?: string[];
  documents?: Document[];
  projects?: EmployeeProject[];
  performanceMetrics?: PerformanceMetric[];
  skills?: string[];
  initials?: string;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience: string;
  education: string;
  status: RESUME_STATUS;
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

// Helper functions
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Export selectable options for form components
export const EMPLOYEE_STATUS_SELECT_OPTIONS = Object.entries(EMPLOYEE_STATUS).map(([_, value]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}));

export const SALARY_BASIS_SELECT_OPTIONS = Object.entries(SALARY_BASIS).map(([_, value]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}));

export const INCENTIVE_TYPE_SELECT_OPTIONS = Object.entries(INCENTIVE_TYPE).map(([_, value]) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1)
}));
