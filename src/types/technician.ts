
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
  completedJobs: number;
  totalRevenue: number;
  rating: number;
  initials: string;
};
