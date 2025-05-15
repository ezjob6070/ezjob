
export interface Job {
  id: string;
  title: string;
  jobNumber?: string;
  clientName: string;
  amount: number;
  status: string;
  actualAmount?: number;
  technicianId?: string;
  technicianName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  date: Date | string;
  scheduledDate?: Date | string;
  createdAt?: string;
  priority?: string;
  details?: string;
  address?: string;
  clientPhone?: string;
  clientEmail?: string;
  notes?: string;
  description?: string;
  serviceType?: string;
  category?: string;
  estimateId?: string;
  isAllDay?: boolean;
  paymentStatus?: string;
  paymentMethod?: string;
  cancellationReason?: string;
  source?: string;
  contractorName?: string;
  contractorId?: string;
  clientId?: string;
  parts?: string[];
  signature?: string;
  hasImages?: boolean;
  imageCount?: number;
}
