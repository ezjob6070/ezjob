
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "active" | "inactive" | "converted" | "follow";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: LeadStatus;
  source: string;
  value: number;
  createdAt: Date;
  notes?: string;
}
