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
}

export type EmployeeStatus = "active" | "inactive" | "on_leave" | "terminated";

export interface EmployeeDocument {
  id: string;
  name: string;
  url: string;
  uploadDate?: string; // Added uploadDate to match usage
}

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
}

export type ResumeStatus = "new" | "reviewing" | "interview" | "rejected" | "hired";

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
}

export interface EmergencyContact {
  name: string;
  relationship?: string;
  relation?: string; // Added for compatibility
  phone: string;
}

export type SalaryBasis = "hourly" | "annual" | "commission";
export type IncentiveType = "bonus" | "commission" | "none";
