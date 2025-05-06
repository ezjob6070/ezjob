
export type SalaryBasis = "hourly" | "weekly" | "bi-weekly" | "monthly" | "annually";
export type IncentiveType = "bonus" | "commission" | "none" | "hourly" | "weekly" | "monthly";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  startDate?: string;
  status: "active" | "inactive" | "onLeave" | "suspended" | "terminated";
  salaryBasis?: SalaryBasis;
  hourlyRate?: number;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  hireDate: string;
}
