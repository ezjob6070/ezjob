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
  
  // Adding salesmen for filtering
  salesmen?: ProjectSalesperson[];
  
  // Adding tasks for progress tracking
  tasks?: ProjectTask[];
  
  // Adding quotes and invoices
  quotes?: ProjectQuote[];
  invoices?: ProjectInvoice[];
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

export interface ProjectSalesperson {
  id: string;
  name: string;
  commission: number;
  commissionType: "fixed" | "percentage";
  totalSales: number;
  totalCommission: number;
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

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
  dependencies?: string[]; // Task IDs this task depends on
  progress: number; // 0-100
  
  // Inspection fields
  inspections?: ProjectTaskInspection[];
  
  // Additional fields for tracking
  lastUpdatedAt?: string;
  comments?: ProjectTaskComment[];
  attachments?: ProjectTaskAttachment[];
}

export interface ProjectTaskInspection {
  id: string;
  title: string;
  status: "pending" | "passed" | "failed" | "not_applicable";
  date?: string;
  inspector?: string;
  notes?: string;
  photos?: string[];
}

export interface ProjectTaskComment {
  id: string;
  text: string;
  author: string;
  date: string;
}

export interface ProjectTaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Quote and invoice interfaces - these remain the same
export interface ProjectQuote {
  id: string;
  createdAt: string;
  sentAt?: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  validUntil: string;
  totalAmount: number;
  items: ProjectQuoteItem[];
  notes?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  termsAndConditions?: string;
  discountAmount?: number;
  discountType?: "fixed" | "percentage";
  taxRate?: number;
  taxAmount?: number;
}

export interface ProjectQuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface ProjectInvoice {
  id: string;
  contractorId: string;
  contractorName: string;
  createdAt: string;
  sentAt?: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  totalAmount: number;
  items: ProjectInvoiceItem[];
  notes?: string;
  paymentTerms?: string;
  reference?: string;
  paymentMethod?: string;
  paidDate?: string;
  paidAmount?: number;
}

export interface ProjectInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  date?: string;
  category?: string;
}
