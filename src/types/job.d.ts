
export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  scheduledDate: string | Date;
  date: string | Date;
  technicianId?: string;
  technicianName?: string;
  serviceId?: string;
  serviceName?: string;
  status: string;
  amount: number;
  actualAmount?: number;
  address?: string;
  notes?: string;
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
  paymentMethod?: string;
  paymentStatus?: string;
  priority?: string;
}
