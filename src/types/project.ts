
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
  
  // Financial data
  expenses?: ProjectExpense[];
  contractors?: ProjectContractor[];
  materials?: ProjectMaterial[];
  equipment?: ProjectEquipment[];
  revenue?: number;
}

export interface ProjectExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  receipt?: string;
  paymentMethod?: string;
  status: "paid" | "pending" | "cancelled";
}

export interface ProjectContractor {
  id: string;
  name: string;
  role: string;
  rate: number;
  rateType: "hourly" | "fixed" | "daily";
  hoursWorked?: number;
  totalPaid: number;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "terminated";
  contact?: string;
  email?: string;
  phone?: string;
}

export interface ProjectMaterial {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  purchaseDate: string;
  category: string;
  status: "ordered" | "delivered" | "used" | "returned";
}

export interface ProjectEquipment {
  id: string;
  name: string;
  type: string;
  rentalCost?: number;
  purchaseCost?: number;
  isRental: boolean;
  startDate?: string;
  endDate?: string;
  totalCost: number;
  status: "active" | "returned" | "owned";
}
