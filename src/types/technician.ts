
export type TechnicianPaymentType = "percentage" | "flat";

export type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: "active" | "inactive";
  paymentType: TechnicianPaymentType;
  paymentRate: number;
  startDate?: Date;
  endDate?: Date;
  completedJobs: number;
  totalRevenue: number;
  rating: number;
  address?: string;
  imageUrl?: string;
  initials: string;
  notes?: string;
};
