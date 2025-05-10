
export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled" | "Not Started";
  completion: number;
  startDate: string;
  endDate: string;
  budget: number;
  team?: string[];
  location?: string;
  workers?: number;
  vehicles?: number;
  materials?: string[];
  milestones?: {
    id: string;
    name: string;
    date: string;
    completed: boolean;
  }[];
  updatedAt?: string;
}
