
export interface JobSource {
  id: string;
  name: string;
  description?: string;
  contactPerson?: string;
  category?: string;
  color?: string;
  type: string;
  completedJobs?: number;
  totalRevenue?: number;
  avgJobValue?: number;
  
  // Add fields that were missing but referenced
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
}

export interface JobSourceTableProps {
  jobSources: JobSource[];
  onSelectJobSource: (jobSource: JobSource) => void;
  selectedFilter?: string;
}
