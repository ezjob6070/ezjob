
import { Technician } from "@/types/technician";
import { Job } from "@/types/job";

// Calculate payment for a contractor based on their payment type
export const calculateContractorPayment = (
  contractor: Technician,
  contractorJobs: Job[],
  completedJobsOnly = true
): number => {
  const filteredJobs = completedJobsOnly 
    ? contractorJobs.filter(job => job.status === "completed")
    : contractorJobs;
  
  const totalRevenue = filteredJobs.reduce(
    (sum, job) => sum + (job.actualAmount || job.amount), 0
  );
  
  const completedJobs = filteredJobs.length;
  
  // Calculate payment based on contractor's payment type
  let payment = 0;
  if (contractor.paymentType === "percentage") {
    payment = totalRevenue * (contractor.paymentRate / 100);
  } else if (contractor.paymentType === "flat") {
    payment = completedJobs * contractor.paymentRate;
  } else if (contractor.paymentType === "hourly") {
    // Assuming average 2 hours per job for calculation purposes
    payment = completedJobs * 2 * contractor.hourlyRate;
  }
  
  return payment;
};

// Calculate an employee's salary based on their salary basis
export const calculateEmployeeSalary = (
  employee: Technician,
  dateRange?: { from: Date; to: Date }
): { monthlySalary: number; periodPayment: number } => {
  let monthlySalary = 0;
  
  if (employee.salaryBasis === "hourly") {
    // Assuming 160 hours per month for full-time employees
    monthlySalary = employee.hourlyRate * 160;
  } else if (employee.salaryBasis === "weekly") {
    monthlySalary = employee.paymentRate * 4.33; // Average weeks in a month
  } else if (employee.salaryBasis === "bi-weekly" || employee.salaryBasis === "biweekly") {
    monthlySalary = employee.paymentRate * 2.17; // Average bi-weekly periods in a month
  } else if (employee.salaryBasis === "monthly") {
    monthlySalary = employee.paymentRate;
  } else if (employee.salaryBasis === "annually" || employee.salaryBasis === "yearly") {
    monthlySalary = employee.paymentRate / 12;
  }
  
  // Calculate period payment based on date range
  let periodPayment = monthlySalary;
  if (dateRange?.from && dateRange?.to) {
    const days = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24);
    periodPayment = (monthlySalary / 30) * days; // Approximate daily rate
  }
  
  // Add incentives if applicable
  if (employee.incentiveType && employee.incentiveAmount) {
    if (employee.incentiveType === "monthly") {
      periodPayment += employee.incentiveAmount;
    } else if (employee.incentiveType === "yearly") {
      periodPayment += employee.incentiveAmount / 12;
    }
  }
  
  return { monthlySalary, periodPayment };
};

// Calculate commission for salespeople
export const calculateSalesCommission = (
  salesperson: Technician,
  salesJobs: Job[]
): { totalRevenue: number; commission: number; salesCount: number; averageSaleValue: number } => {
  const totalRevenue = salesJobs.reduce(
    (sum, job) => sum + (job.actualAmount || job.amount), 0
  );
  
  const salesCount = salesJobs.length;
  const averageSaleValue = salesCount > 0 ? totalRevenue / salesCount : 0;
  
  // Calculate commission based on salesperson's payment type
  let commission = 0;
  if (salesperson.paymentType === "percentage") {
    commission = totalRevenue * (salesperson.paymentRate / 100);
  } else if (salesperson.paymentType === "flat") {
    commission = salesCount * salesperson.paymentRate;
  }
  
  return { totalRevenue, commission, salesCount, averageSaleValue };
};
