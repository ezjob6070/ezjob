
export type Lead = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  source?: string;
  value?: number;
  createdAt: Date;
  notes?: string;
};
