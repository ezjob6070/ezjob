
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
  title: string;
  description: string;
  date: string;
  userId?: string;
  userName?: string;
}

export interface ProjectTaskInspection {
  id: string;
  title: string;
  status: "pending" | "passed" | "failed";
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
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
  deliveryDate?: string;
  status: "ordered" | "delivered" | "used" | "surplus";
  notes?: string;
  name: string;
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
