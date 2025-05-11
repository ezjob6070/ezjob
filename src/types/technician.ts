
// Assuming this file exists and we need to add the missing properties
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string;
  startDate?: string;
  status: 'active' | 'inactive' | 'onLeave';
  availability?: string;
  specialty?: string;
  notes?: string;
  rating?: number;
  completedJobs?: number;
  totalRevenue?: number;
  image?: string;
  paymentType: string;
  paymentRate: number;
  hourlyRate: number;
  commission?: number;
  salaryBasis?: string;
  weeklyHours?: number;
  monthlySalary?: number;
  periodPayment?: number;
  bankAccount?: string;
  insurance?: string;
  licenseNumber?: string | { number: string; state: string; expirationDate: string };
  certifications?: string[];
  education?: string;
  emergencyContact?: string;
  workContract?: string;
  role: 'technician' | 'salesman' | 'employed' | 'contractor';
  subRole?: string;
  documents?: Document[];
  initials?: string;
}

export interface Document {
  id: string;
  name: string;
  title?: string;
  type: string;
  size?: number;
  uploadDate: string;
  url: string;
}
