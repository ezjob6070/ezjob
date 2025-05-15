
import { Technician } from "@/types/technician";

export interface FinancialSummary {
  totalRevenue: number;
  totalJobs: number;
  averageJobValue: number;
  paymentsDue: number;
  technicianEarnings?: number;
  companyProfit?: number;
}

export const calculateFinancialMetrics = (technicians: Technician[]): FinancialSummary => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const totalJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  
  // Calculate earnings based on payment type
  const technicianEarnings = technicians.reduce((sum, tech) => {
    if (!tech.totalRevenue) return sum;
    
    if (tech.paymentType === "percentage") {
      return sum + tech.totalRevenue * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat" && tech.completedJobs) {
      return sum + tech.completedJobs * tech.paymentRate;
    } else if (tech.paymentType === "hourly" && tech.completedJobs) {
      // Estimate hours per job (assuming 2 hours per job as a default)
      const estimatedHours = tech.completedJobs * 2;
      return sum + estimatedHours * tech.paymentRate;
    } else if (tech.paymentType === "salary") {
      // For salaried workers, no additional earnings per job
      return sum;
    }
    
    return sum;
  }, 0);
  
  // Approximate company profit (revenue - technician earnings)
  const companyProfit = totalRevenue - technicianEarnings;
  
  return {
    totalRevenue,
    totalJobs,
    averageJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0,
    paymentsDue: totalRevenue * 0.2, // Rough estimate of outstanding payments
    technicianEarnings,
    companyProfit
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
