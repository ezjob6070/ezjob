
import { Technician } from "@/types/technician";
import { format } from "date-fns";

/**
 * Calculate financial metrics for a group of technicians
 */
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const completedJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  const averageJobValue = completedJobs > 0 ? totalRevenue / completedJobs : 0;
  
  // Calculate total payment due to technicians based on their payment types
  const totalPaymentsDue = technicians.reduce((sum, tech) => {
    if (tech.paymentType === "percentage") {
      return sum + (tech.totalRevenue || 0) * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat") {
      return sum + (tech.completedJobs || 0) * tech.paymentRate;
    } else if (tech.paymentType === "hourly") {
      // Estimate hours per job (2 hours per job as default)
      return sum + (tech.completedJobs || 0) * 2 * tech.hourlyRate;
    }
    return sum;
  }, 0);
  
  return {
    totalRevenue,
    totalJobs: completedJobs,
    averageJobValue,
    paymentsDue: totalPaymentsDue
  };
};

/**
 * Calculate financial metrics for a single technician
 */
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) {
    return {
      technician: null,
      totalRevenue: 0,
      completedJobs: 0,
      cancelledJobs: 0, 
      paymentDue: 0,
      profit: 0
    };
  }
  
  const totalRevenue = technician.totalRevenue || 0;
  const completedJobs = technician.completedJobs || 0;
  const cancelledJobs = technician.cancelledJobs || 0;
  
  // Calculate payment due based on payment type
  let paymentDue = 0;
  if (technician.paymentType === "percentage") {
    paymentDue = totalRevenue * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat") {
    paymentDue = completedJobs * technician.paymentRate;
  } else if (technician.paymentType === "hourly") {
    // Estimate hours per job (2 hours per job as default)
    paymentDue = completedJobs * 2 * technician.hourlyRate;
  }
  
  const profit = totalRevenue - paymentDue;
  
  return {
    technician,
    totalRevenue,
    completedJobs,
    cancelledJobs,
    paymentDue,
    profit
  };
};

/**
 * Format date range as display text
 */
export const formatDateRangeText = (dateRange: { from?: Date, to?: Date }): string => {
  if (!dateRange.from) return "All time";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
};
