
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval, parseISO } from "date-fns";

// Calculate financial metrics for a group of technicians
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
  const companyProfit = totalRevenue - technicianEarnings;
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit
  };
};

// Calculate metrics for a single technician
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  // Calculate earnings based on payment type
  let earnings = 0;
  if (technician.paymentType === 'percentage' && technician.paymentRate) {
    earnings = (technician.totalRevenue || 0) * (technician.paymentRate / 100);
  } else if (technician.paymentType === 'flat' && technician.paymentRate) {
    earnings = (technician.completedJobs || 0) * technician.paymentRate;
  } else if (technician.paymentType === 'hourly' && technician.hourlyRate) {
    // Assume 2 hours per job for simplicity
    earnings = (technician.completedJobs || 0) * 2 * technician.hourlyRate;
  }
  
  return {
    earnings,
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0,
    revenue: technician.totalRevenue || 0,
    profit: (technician.totalRevenue || 0) - earnings
  };
};

// Format date range as text for display
export const formatDateRangeText = (dateRange: DateRange | undefined): string => {
  if (!dateRange?.from) return "All time";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
};

// Ensure a date range has both from and to dates
export const ensureCompleteDateRange = (dateRange?: DateRange): DateRange => {
  if (!dateRange) {
    const today = new Date();
    return { from: today, to: today };
  }
  
  if (!dateRange.from && dateRange.to) {
    return { from: dateRange.to, to: dateRange.to };
  }
  
  if (dateRange.from && !dateRange.to) {
    return { from: dateRange.from, to: dateRange.from };
  }
  
  return dateRange;
};

// Filter technician data by date range
export const filterTechniciansByDate = (
  technicians: Technician[], 
  dateRange?: DateRange
): Technician[] => {
  if (!dateRange?.from) return technicians;
  
  return technicians.filter(tech => {
    if (!tech.hireDate) return true;
    
    const hireDate = typeof tech.hireDate === 'string' 
      ? parseISO(tech.hireDate)
      : tech.hireDate;
    
    if (dateRange.to) {
      return isWithinInterval(hireDate, { 
        start: dateRange.from, 
        end: dateRange.to 
      });
    }
    
    return hireDate >= dateRange.from;
  });
};
