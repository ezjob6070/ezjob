
export interface Job {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  clientName: string;
  technician?: {
    id: string;
    name: string;
  };
  technicianId: string;
  technicianName?: string;
  scheduledDate: string | Date;
  date: string | Date;
  time?: string;
  expectedDuration?: number;
  serviceCategory?: string;
  serviceType?: string;
  amount: number;
  actualAmount?: number;
  jobSource?: string;
  notes?: string;
  address?: string;
  paymentMethod?: string;
  attachments?: any[];
  images?: any[];
  allDay?: boolean;
  contactName?: string;
  contactPhone?: string;
  contractorId?: string;
  contractorName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  parts?: string[];
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentStatus?: string;
  // Additional fields from JobTypes.ts
  jobNumber?: string;
  clientPhone?: string;
  clientEmail?: string;
  details?: string;
  category?: string;
  estimateId?: string;
  isAllDay?: boolean;
  source?: string;
  signature?: string;
  hasImages?: boolean;
  imageCount?: number;
}
