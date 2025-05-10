
export interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  completion: number;
  workers: number;
  vehicles: number;
  status: string;
  startDate: string;
  expectedEndDate: string; 
  budget: number;
  actualSpent: number;
  clientName: string;
  clientId?: string;
  managerId?: string;
  managerName?: string;
  priority?: string;
  notes?: string[];
  tasks?: ProjectTask[];
  changes?: ProjectChange[];
  attachments?: string[];
  coordinates?: { lat: number; lng: number };
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  dueDate?: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
  created: string;
}

export interface ProjectChange {
  id: string;
  type: "scope" | "timeline" | "budget" | "personnel" | "other";
  description: string;
  date: string;
  requestedBy: string;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: string;
  costImpact?: number;
  scheduleImpact?: number; // in days
}
