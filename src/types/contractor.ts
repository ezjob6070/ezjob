
import { Technician } from './technician';

export interface ContractorProject {
  id: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "canceled";
  role: string;
  value: number;
}

export interface ContractorPayment {
  id: string;
  date: string;
  amount: number;
  projectId?: number;
  projectName?: string;
  status: "pending" | "paid" | "cancelled";
  description?: string;
}

export interface ContractorDetail extends Technician {
  projects?: ContractorProject[];
  payments?: ContractorPayment[];
  skills: string[];
  specialties: string[];
  contractTerms?: string;
  taxId?: string;
  businessName?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  insurance?: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
    coverageAmount: number;
  };
  agreementSigned?: boolean;
  agreementDate?: string;
  invoices?: ContractorInvoice[];
  quotes?: ContractorQuote[];
}

export interface ContractorInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  projectId?: number;
  projectName?: string;
  description?: string;
}

export interface ContractorQuote {
  id: string;
  quoteNumber: string;
  date: string;
  validUntil: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  projectId?: number;
  projectName?: string;
  description?: string;
}

export interface ContractorFilter {
  search: string;
  status: "all" | "active" | "inactive" | "onleave";
  specialties: string[];
  subRoles: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
