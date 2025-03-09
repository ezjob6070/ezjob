
export enum EmployeeStatus {
  ACTIVE = "active",
  PENDING = "pending",
  INACTIVE = "inactive",
}

export enum ResumeStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum DocumentType {
  ID = "id",
  PASSPORT = "passport",
  DRIVERS_LICENSE = "drivers_license",
  WORK_PERMIT = "work_permit",
  OTHER = "other"
}

export interface EmployeeDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  dateUploaded: Date;
  expiryDate?: Date;
  notes?: string;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  status: ResumeStatus;
  dateSubmitted: Date;
  resumeUrl: string;
  notes: string;
}

export interface EmployeeNote {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  dateHired: Date;
  reportsTo?: string;
  salary: number;
  address: string;
  profileImage?: string;
  skills: string[];
  dateOfBirth?: Date;
  emergencyContact?: string;
  background?: string;
  education?: string[];
  certifications?: string[];
  performanceRating?: number;
  notes?: EmployeeNote[];
  documents?: EmployeeDocument[];
}

export interface Report {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  dateSubmitted: Date;
}
