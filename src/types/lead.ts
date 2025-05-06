
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "active" | "inactive" | "converted" | "follow";

export type Lead = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source?: string;
  value?: number;
  createdAt: Date;
  notes?: string;
};
