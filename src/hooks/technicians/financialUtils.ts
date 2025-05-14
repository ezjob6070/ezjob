
import { Technician } from "@/types/technician";

/**
 * Helper function to safely access technician roles
 * @param technician The technician object
 * @returns The role value or "technician" as default
 */
export function getTechnicianRole(technician: Technician): string {
  return technician.role || "technician";
}

/**
 * Helper function to safely access technician sub-roles
 * @param technician The technician object
 * @returns The subRole value or an empty string
 */
export function getTechnicianSubRole(technician: Technician): string {
  return technician.subRole || "";
}

/**
 * Calculate the monthly salary for a technician based on their payment structure
 * @param technician The technician object
 * @returns The calculated monthly salary
 */
export function calculateMonthlySalary(technician: Technician): number {
  let monthlySalary = 0;
  
  if (technician.salaryBasis === "hourly" && technician.hourlyRate) {
    // Assuming 160 hours per month for full-time employees
    monthlySalary = technician.hourlyRate * 160;
  } else if (technician.salaryBasis === "weekly" && technician.paymentRate) {
    monthlySalary = technician.paymentRate * 4.33; // Average weeks in a month
  } else if ((technician.salaryBasis === "bi-weekly" || technician.salaryBasis === "biweekly") && technician.paymentRate) {
    monthlySalary = technician.paymentRate * 2.17; // Average bi-weekly periods in a month
  } else if (technician.salaryBasis === "monthly" && technician.paymentRate) {
    monthlySalary = technician.paymentRate;
  } else if ((technician.salaryBasis === "annually" || technician.salaryBasis === "yearly") && technician.paymentRate) {
    monthlySalary = technician.paymentRate / 12;
  }
  
  return monthlySalary;
}

/**
 * Calculate commission or payment for a technician based on revenue and job count
 * @param technician The technician object
 * @param totalRevenue Total revenue amount
 * @param completedJobs Number of completed jobs
 * @returns The calculated payment amount
 */
export function calculateTechnicianPayment(
  technician: Technician, 
  totalRevenue: number, 
  completedJobs: number
): number {
  let payment = 0;
  
  if (technician.paymentType === "percentage" && technician.paymentRate) {
    payment = totalRevenue * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat" && technician.paymentRate) {
    payment = completedJobs * technician.paymentRate;
  } else if (technician.paymentType === "hourly" && technician.hourlyRate) {
    // Assuming average 2 hours per job for calculation purposes
    payment = completedJobs * 2 * technician.hourlyRate;
  } else if (technician.incentiveType === "commission" && technician.incentiveAmount) {
    payment = totalRevenue * (technician.incentiveAmount / 100);
  }
  
  return payment;
}
