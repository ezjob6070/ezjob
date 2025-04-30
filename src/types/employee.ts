
// The file might contain more than this, but adding only the part we need to modify
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  hireDate: string;
  status: EmployeeStatus;
  salary: number;
  salaryBasis: SalaryBasis;
  manager: string;
  emergencyContact: EmergencyContact;
  documents: EmployeeDocument[];
  notes: EmployeeNote[];
  // Add missing properties referenced in components
  dateHired?: string;
  reportsTo?: string;
  taxPercentage?: number;
  address?: string;
  skills?: string[];
  education?: string;
  background?: string;
  performanceRating?: number;
  profileImage?: string;
  photo?: string;
  initials?: string;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
}

export type EmployeeStatus = "active" | "inactive" | "on_leave" | "terminated" | "pending";

// Adding PENDING for the referenced constant in components
export const EMPLOYEE_STATUS = {
  ACTIVE: "active" as EmployeeStatus,
  INACTIVE: "inactive" as EmployeeStatus,
  ON_LEAVE: "on_leave" as EmployeeStatus,
  TERMINATED: "terminated" as EmployeeStatus,
  PENDING: "pending" as EmployeeStatus,
};

export interface EmployeeDocument {
  id: string;
  name: string;
  url: string;
  uploadDate?: string;
  type?: DocumentType;
  dateUploaded?: string;
  expiryDate?: string;
  notes?: string;
}

export type DocumentType = "resume" | "id" | "certificate" | "contract" | "other";

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education?: string; // Added education to match usage
  status: ResumeStatus;
  submittedDate: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  notes?: string;
  // Add missing properties referenced in components
  candidateName?: string;
  dateSubmitted?: string;
}

export type ResumeStatus = "new" | "reviewing" | "interview" | "rejected" | "hired" | "approved";

// Adding constants for ResumeStatus that are referenced in the components
export const RESUME_STATUS = {
  NEW: "new" as ResumeStatus,
  REVIEWING: "reviewing" as ResumeStatus,
  INTERVIEW: "interview" as ResumeStatus,
  REJECTED: "rejected" as ResumeStatus,
  HIRED: "hired" as ResumeStatus,
  APPROVED: "approved" as ResumeStatus,
};

export interface EmployeeNote {
  id: string;
  content: string;
  date: string;
  author: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  author: string;
  department?: string; // Added department to match usage
  date: string;
  documentUrl: string;
  shared: string[];
  // Add missing properties referenced in components
  employeeId?: string;
  dateSubmitted?: string;
  status?: string;
}

export interface EmergencyContact {
  name: string;
  relationship?: string;
  relation?: string; // Added for compatibility
  phone: string;
}

export type SalaryBasis = "hourly" | "annual" | "commission";

export type IncentiveType = "bonus" | "commission" | "none";

// Adding constants needed for dropdowns and selects
export const SALARY_BASIS_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "annual", label: "Annual" },
  { value: "commission", label: "Commission" }
];

export const INCENTIVE_TYPE_OPTIONS = [
  { value: "bonus", label: "Bonus" },
  { value: "commission", label: "Commission" },
  { value: "none", label: "None" }
];
