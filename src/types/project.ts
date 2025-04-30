
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
}
