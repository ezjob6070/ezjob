// Define Project types

export interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  completion: number;
  workers: number;
  vehicles: number;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  startDate: string;
  expectedEndDate: string;
  budget: number;
  actualSpent: number;
  clientName: string;
  revenue: number;
  tasks?: ProjectTask[];
  equipment?: ProjectEquipment[];
  materials?: ProjectMaterial[];
  contractors?: ProjectContractor[];
  staff?: ProjectStaff[];
  // Add any other fields needed for projects
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  assignedTo?: string;
  createdAt?: string;
  completedAt?: string;
  lastUpdatedAt?: string;
  progress: number;
  inspections?: ProjectTaskInspection[];
  comments?: ProjectTaskComment[];
  attachments?: ProjectTaskAttachment[];
  client?: string;
  location?: string;
  isReminder?: boolean;
  reminderTime?: string;
  reminderSent?: boolean;
  history?: ProjectTaskHistoryEntry[];
}

export interface ProjectTaskHistoryEntry {
  id?: string;
  title: string;
  description: string;
  date: string;
  userId?: string;
  userName?: string;
}

export interface ProjectTaskInspection {
  id: string;
  title: string;
  status: "pending" | "passed" | "failed" | "not_applicable";
  comments?: string;
  date?: string;
  inspector?: string;
}

export interface ProjectTaskComment {
  id: string;
  userId: string;
  userName: string;
  date: string;
  content: string;
}

export interface ProjectTaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedBy?: string;
  uploadDate: string;
}

export interface ProjectStaff {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "inactive";
  avatar?: string;
  position?: string;
  subRole?: string;
  // Other staff-related fields
}

export interface ProjectEquipment {
  id: string;
  name: string;
  type: string;
  status: "available" | "in_use" | "maintenance" | "unavailable";
  assignedTo?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  notes?: string;
}

export interface ProjectMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  deliveryDate?: string;
  status: "ordered" | "delivered" | "used" | "surplus";
  notes?: string;
}

export interface ProjectContractor {
  id: string;
  name: string;
  company: string;
  role: string;
  contractStart?: string;
  contractEnd?: string;
  rate: number;
  rateType: "hourly" | "daily" | "fixed";
  totalPaid: number;
  status: "active" | "completed" | "terminated";
  contact?: {
    phone?: string;
    email?: string;
  };
}

// Extended Technician interface to match what's used in the components
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "inactive" | "on_leave" | "terminated";
  paymentType: "percentage" | "flat" | "hourly" | "salary" | "commission";
  paymentRate: number;
  hourlyRate: number;
  role?: "technician" | "salesman" | "employed" | "contractor";
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
  specialty?: string;
  initials?: string;
  profileImage?: string;
  imageUrl?: string;
  salaryBasis?: "hourly" | "daily" | "weekly" | "bi-weekly" | "monthly" | "annually";
  incentiveType?: "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly" | "profit-sharing";
  incentiveAmount?: number;
  ssn?: string;
  driverLicense?: {
    number: string;
    state: string;
    expirationDate: string;
  };
  idNumber?: string;
  subRole?: string;
  documents?: any[];
}

// Extended job interface to match what's used in the components
export interface Job {
  id: string;
  title: string;
  jobNumber?: string;
  clientName: string;
  amount: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "canceled" | "rescheduled" | "estimate" | "pending";
  actualAmount?: number;
  technicianId: string;  
  technicianName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  date: Date | string;
  scheduledDate?: Date | string;
  createdAt?: string;
}
