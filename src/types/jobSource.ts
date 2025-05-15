
export interface JobSource {
  id: string;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: "active" | "inactive";
  jobCount?: number;
  revenue?: number;
  // Additional properties that are being accessed
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
}
