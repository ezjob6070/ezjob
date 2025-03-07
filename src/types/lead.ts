
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost";

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  value: number;
  status: LeadStatus;
  notes: string;
  assignedTo?: string;
  createdAt: Date;
  lastContactedAt: Date | null;
  nextFollowUp?: Date;
};
