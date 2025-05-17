
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
  status: "active" | "inactive" | "onLeave";
  specialty: string;
  paymentType: "percentage" | "flat" | "hourly" | "salary" | "commission";
  paymentRate: number;
  hourlyRate: number;
  salaryBasis?: string;
  incentiveType?: string;
  incentiveAmount?: number;
  rating: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  notes?: string;
  profileImage?: string;
  imageUrl?: string;
  certifications?: string[];
  skills?: string[];
  category?: string;
  // Add missing properties that were referenced in the errors
  role?: string;
  subRole?: string;
  yearsExperience?: number;
  initials?: string;
  documents?: any[];
  ssn?: string;
  driverLicense?: string;
  idNumber?: string;
}
