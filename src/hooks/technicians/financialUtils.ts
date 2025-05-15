
import { Technician } from "@/types/technician";

export interface FinancialSummary {
  totalRevenue: number;
  totalJobs: number;
  averageJobValue: number;
  paymentsDue: number;
  technicianEarnings?: number;
  companyProfit?: number;
}

export interface TechnicianMetrics {
  revenue: number;
  earnings: number;
  expenses: number;
  profit: number;
  totalJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
}

export const calculateTechnicianMetrics = (technician: Technician | null): TechnicianMetrics | null => {
  if (!technician) return null;
  
  const revenue = technician.totalRevenue || 0;
  let earnings = 0;
  
  // Calculate earnings based on payment type
  if (technician.paymentType === "percentage") {
    earnings = revenue * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat" && technician.completedJobs) {
    earnings = technician.completedJobs * technician.paymentRate;
  } else if (technician.paymentType === "hourly" && technician.completedJobs) {
    // Estimate hours per job (assuming 2 hours per job as a default)
    const estimatedHours = technician.completedJobs * 2;
    earnings = estimatedHours * technician.paymentRate;
  } else if (technician.paymentType === "salary") {
    // For salaried workers, use monthly salary as earnings
    earnings = technician.monthlySalary || 0;
  }
  
  // Approximate expenses (20% of revenue)
  const expenses = revenue * 0.2;
  
  // Profit is revenue minus earnings and expenses
  const profit = revenue - earnings - expenses;
  
  return {
    revenue,
    earnings,
    expenses,
    profit,
    totalJobs: technician.completedJobs ? technician.completedJobs + (technician.cancelledJobs || 0) : undefined,
    completedJobs: technician.completedJobs,
    cancelledJobs: technician.cancelledJobs
  };
};

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

export const formatDateRangeText = (dateRange: { from?: Date; to?: Date }): string => {
  if (!dateRange.from) return "";
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: dateRange.from.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  };
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return dateRange.from.toLocaleDateString('en-US', options);
    }
    
    // Different days
    return `${dateRange.from.toLocaleDateString('en-US', options)} - ${dateRange.to.toLocaleDateString('en-US', options)}`;
  }
  
  // Only start date
  return dateRange.from.toLocaleDateString('en-US', options);
};
