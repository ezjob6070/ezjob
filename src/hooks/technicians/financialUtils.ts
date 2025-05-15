
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

/**
 * Calculate financial metrics for a list of technicians
 */
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => {
    if (tech.paymentType === "percentage") {
      return sum + ((tech.totalRevenue || 0) * tech.paymentRate / 100);
    } else if (tech.paymentType === "flat") {
      return sum + ((tech.completedJobs || 0) * tech.paymentRate);
    }
    return sum;
  }, 0);
  
  const companyProfit = totalRevenue - technicianEarnings;
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit,
    totalJobs: technicians.reduce((sum, tech) => sum + ((tech.completedJobs || 0) + (tech.cancelledJobs || 0)), 0),
    completedJobs: technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0),
    pendingJobs: 0,
    cancelledJobs: technicians.reduce((sum, tech) => sum + (tech.cancelledJobs || 0), 0),
    averageJobValue: calculateAverageJobValue(technicians)
  };
};

/**
 * Calculate average job value
 */
export const calculateAverageJobValue = (technicians: Technician[]) => {
  const totalJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  
  if (totalJobs === 0) return 0;
  return totalRevenue / totalJobs;
};

/**
 * Calculate technician-specific metrics
 */
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  return {
    revenue: technician.totalRevenue || 0,
    earnings: calculateTechnicianEarnings(technician),
    expenses: (technician.totalRevenue || 0) * 0.2, // Estimated expenses as 20% of revenue
    profit: (technician.totalRevenue || 0) - calculateTechnicianEarnings(technician) - ((technician.totalRevenue || 0) * 0.2),
    totalJobs: (technician.completedJobs || 0) + (technician.cancelledJobs || 0),
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0
  };
};

/**
 * Calculate technician earnings based on payment type
 */
export const calculateTechnicianEarnings = (technician: Technician) => {
  if (technician.paymentType === "percentage") {
    return (technician.totalRevenue || 0) * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat") {
    return (technician.completedJobs || 0) * technician.paymentRate;
  } else if (technician.paymentType === "hourly") {
    // Estimate 4 hours per job for hourly rate
    return (technician.completedJobs || 0) * 4 * technician.hourlyRate;
  }
  return 0;
};

/**
 * Format date range for display
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
