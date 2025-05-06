
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "active" | "inactive" | "converted" | "follow";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  service?: string;
  status: LeadStatus;
  source: string;
  value: number;
  createdAt: Date;
  dateAdded?: Date; // For compatibility with existing components
  notes?: string;
  estimatedClosingDate?: Date;
  assignedTo?: string;
  lastContactDate?: Date;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}

export const LEAD_STATUS_COLORS = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  qualified: "bg-indigo-100 text-indigo-800",
  proposal: "bg-cyan-100 text-cyan-800",
  negotiation: "bg-amber-100 text-amber-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-rose-100 text-rose-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  converted: "bg-blue-100 text-blue-800",
  follow: "bg-amber-100 text-amber-800"
};

export const LEAD_SOURCES = [
  "Website", 
  "Referral", 
  "Google Ads", 
  "Facebook", 
  "Instagram", 
  "LinkedIn", 
  "Direct Mail",
  "Email Campaign", 
  "Trade Show", 
  "Cold Call", 
  "Partner", 
  "Other"
];

export const LEAD_SERVICES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "General Contracting",
  "Remodeling",
  "Landscaping",
  "Roofing",
  "Painting",
  "Flooring",
  "Cleaning",
  "Other"
];
