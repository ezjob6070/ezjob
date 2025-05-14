
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Calculate total financial metrics across all technicians
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const totalJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  const averageJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
  const paymentsDue = totalRevenue * 0.3; // Example calculation, adjust as needed
  
  return {
    totalRevenue,
    totalJobs,
    averageJobValue,
    paymentsDue
  };
};

// Calculate metrics for a single technician
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  const revenue = technician.totalRevenue || 0;
  const techEarnings = revenue * (technician.paymentType === "percentage" ? technician.paymentRate / 100 : 0.2);
  const expenses = revenue * 0.2; // Assuming expenses are 20% of total revenue
  const profit = revenue - techEarnings - expenses;
  
  return {
    revenue,
    earnings: techEarnings,
    expenses,
    profit,
    totalJobs: technician.completedJobs || 0,
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0
  };
};

// Format date range for display
export const formatDateRangeText = (dateRange?: DateRange) => {
  if (!dateRange?.from) return "All Time";
  
  if (dateRange.to) {
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
};
