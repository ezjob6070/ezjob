
export type EstimateStatus = "sent" | "in-process" | "completed";

export type EstimateItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Estimate = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle?: string; // For backwards compatibility
  jobTitle: string;
  description: string;
  amount: number;
  status: EstimateStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  items: EstimateItem[];
  clientAddress?: string;
  images?: string[];
  price?: number;
  tax?: number;
};
