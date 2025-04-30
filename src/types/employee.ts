
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
  status: string;  // Changed from EmployeeStatus to string
  salary: number;
  salaryBasis: string;  // Changed from SalaryBasis to string
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
  incentiveType?: string;
  incentiveAmount?: number;
  dateOfBirth?: string;
  certifications?: string[];
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
}

export type EmployeeStatus = "active" | "inactive" | "on_leave" | "terminated" | "pending" | "contract" | "probation";

// Adding PENDING for the referenced constant in components
export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "on_leave",
  TERMINATED: "terminated",
  PENDING: "pending",
  CONTRACT: "contract",
  PROBATION: "probation"
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

export type DocumentType = "resume" | "id" | "certificate" | "contract" | "other" | "passport" | "drivers_license" | "work_permit";

// Define DocumentType constants
export const DOCUMENT_TYPE = {
  ID: "id",
  RESUME: "resume",
  CERTIFICATE: "certificate",
  CONTRACT: "contract",
  PASSPORT: "passport",
  DRIVERS_LICENSE: "drivers_license",
  WORK_PERMIT: "work_permit",
  OTHER: "other"
};

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education?: string;
  status: string; // Changed from ResumeStatus to string
  submittedDate: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  notes?: string;
  // Add missing properties referenced in components
  candidateName?: string;
  dateSubmitted?: string;
}

export type ResumeStatus = "new" | "reviewing" | "interview" | "rejected" | "hired" | "approved" | "pending";

// Adding constants for ResumeStatus that are referenced in the components
export const RESUME_STATUS = {
  NEW: "new",
  REVIEWING: "reviewing",
  INTERVIEW: "interview",
  REJECTED: "rejected",
  HIRED: "hired",
  APPROVED: "approved",
  PENDING: "pending"
};

export interface EmployeeNote {
  id: string;
  content: string;
  date: string;
  author: string;
  createdAt?: string;
  createdBy?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  author: string;
  department?: string;
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

export type SalaryBasis = "hourly" | "annual" | "commission" | "weekly" | "monthly" | "yearly";

export const SALARY_BASIS = {
  HOURLY: "hourly",
  ANNUAL: "annual",
  COMMISSION: "commission",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

// Export IncentiveType to fix the error
export type IncentiveType = "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";

export const INCENTIVE_TYPE = {
  BONUS: "bonus",
  COMMISSION: "commission",
  NONE: "none",
  HOURLY: "hourly",
  WEEKLY: "weekly",
  MONTHLY: "monthly"
};

// Adding constants needed for dropdowns and selects
export const SALARY_BASIS_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "annual", label: "Annual" },
  { value: "commission", label: "Commission" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];

export const INCENTIVE_TYPE_OPTIONS = [
  { value: "bonus", label: "Bonus" },
  { value: "commission", label: "Commission" },
  { value: "none", label: "None" },
  { value: "hourly", label: "Per Hour" },
  { value: "weekly", label: "Per Week" },
  { value: "monthly", label: "Per Month" }
];

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
  { value: "pending", label: "Pending" },
  { value: "contract", label: "Contract" },
  { value: "probation", label: "Probation" }
];

export const RESUME_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" }
];
