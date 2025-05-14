
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

/**
 * Calculates financial metrics for an array of technicians
 */
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  let totalRevenue = 0;
  let technicianEarnings = 0;
  let companyProfit = 0;
  let totalJobs = 0;
  let avgJobValue = 0;

  technicians.forEach(tech => {
    // Calculate total revenue
    totalRevenue += tech.totalRevenue || 0;
    
    // Calculate total jobs
    totalJobs += (tech.completedJobs || 0) + (tech.cancelledJobs || 0);
    
    // Calculate technician earnings based on payment type
    let earnings = 0;
    if (tech.paymentType === "percentage") {
      earnings = (tech.totalRevenue || 0) * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat") {
      earnings = (tech.completedJobs || 0) * tech.paymentRate;
    } else if (tech.paymentType === "hourly") {
      // Assuming average 2 hours per job for calculation purposes
      earnings = (tech.completedJobs || 0) * 2 * tech.hourlyRate;
    }
    
    technicianEarnings += earnings;
  });

  // Calculate company profit (revenue - earnings)
  companyProfit = totalRevenue - technicianEarnings;
  
  // Calculate average job value
  avgJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

  return {
    totalRevenue,
    technicianEarnings,
    companyProfit,
    totalJobs,
    averageJobValue: avgJobValue
  };
};

/**
 * Calculate financial metrics for a single technician
 */
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  const totalRevenue = technician.totalRevenue || 0;
  const completedJobs = technician.completedJobs || 0;
  const cancelledJobs = technician.cancelledJobs || 0;
  const totalJobs = completedJobs + cancelledJobs;
  
  // Calculate earnings based on payment type
  let earnings = 0;
  if (technician.paymentType === "percentage") {
    earnings = totalRevenue * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat") {
    earnings = completedJobs * technician.paymentRate;
  } else if (technician.paymentType === "hourly") {
    // Assuming average 2 hours per job for calculation
    earnings = completedJobs * 2 * technician.hourlyRate;
  }
  
  // Estimate parts value at 20% of revenue
  const partsValue = totalRevenue * 0.2;
  
  // Company profit is revenue minus earnings and parts
  const companyProfit = totalRevenue - earnings - partsValue;
  
  // Calculate average job value
  const avgJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

  return {
    totalRevenue,
    earnings,
    partsValue,
    companyProfit,
    completedJobs,
    cancelledJobs,
    totalJobs,
    averageJobValue: avgJobValue
  };
};

/**
 * Format a date range for display
 */
export const formatDateRangeText = (dateRange?: DateRange) => {
  if (!dateRange?.from) return "";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
};
