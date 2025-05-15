
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
  hourlyRate: number;
  paymentRate: number;
  status: string;
  specialty?: string;
  skills?: string[];
  location?: string;
  availableDays?: string[];
  workHours?: { start: string; end: string };
  profileImage?: string;
  salary?: number;
  salaryBasis?: 'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annually' | 'yearly';
  incentiveType?: string;
  incentiveAmount?: number;
  paymentType?: 'percentage' | 'flat' | 'hourly';
  role?: 'contractor' | 'employed' | 'salesman';
  subRole?: string;
  category?: string;
}
