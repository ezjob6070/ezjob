
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export function calculateFinancialMetrics(technicians: Technician[]) {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
  const companyProfit = totalRevenue - technicianEarnings;
  const totalJobs = technicians.reduce((sum, tech) => sum + (tech.jobCount || 0), 0);
  const completedJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  const cancelledJobs = technicians.reduce((sum, tech) => sum + (tech.cancelledJobs || 0), 0);
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit,
    totalJobs,
    completedJobs,
    cancelledJobs,
    averageJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0
  };
}

export function calculateTechnicianMetrics(technician: Technician | null) {
  if (!technician) return null;
  
  const earnings = technician.earnings || 0;
  const companyProfit = (technician.totalRevenue || 0) - earnings;
  const completionRate = technician.jobCount && technician.jobCount > 0 
    ? (technician.completedJobs || 0) / technician.jobCount * 100 
    : 0;
  
  return {
    earnings,
    companyProfit,
    completionRate
  };
}

export function formatDateRangeText(dateRange: DateRange | undefined): string {
  if (!dateRange?.from) return "All time";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
}
