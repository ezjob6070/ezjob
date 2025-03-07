
export type EstimateStatus = "sent" | "in-process" | "completed";

export type Estimate = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  description: string;
  images: string[];
  price: number;
  tax: number;
  status: EstimateStatus;
  createdAt: Date;
  updatedAt: Date;
};
