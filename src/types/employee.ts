
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
}

export interface Report {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  dateSubmitted: Date;
}
