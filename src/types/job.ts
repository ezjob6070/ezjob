
export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  client: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  technicianId?: string;
  technicianName?: string;
  clientName?: string;
  scheduledDate: string;
  date?: string | Date;
  time?: string;
  expectedDuration: number;
  serviceCategory: string;
  serviceType: string;
  amount: number;
  actualAmount?: number;
  jobSource?: string;
  notes?: string;
  address?: string;
  paymentMethod?: string;
  attachments?: any[];
  images?: any[];
  allDay?: boolean;
}
