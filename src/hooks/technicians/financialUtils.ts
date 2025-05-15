
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Calculate financial metrics for a list of technicians
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
  const companyProfit = totalRevenue - technicianEarnings;
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit,
    techniciansCount: technicians.length,
    averageRevenue: technicians.length > 0 ? totalRevenue / technicians.length : 0,
  };
};

// Calculate metrics for a single technician
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  const earnings = technician.totalRevenue ? 
    (technician.paymentType === "percentage" 
      ? technician.totalRevenue * ((technician.paymentRate || 0) / 100)
      : (technician.jobCount || 0) * (technician.paymentRate || 0))
    : 0;
  
  return {
    revenue: technician.totalRevenue || 0,
    earnings,
    jobCount: technician.jobCount || 0,
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0,
    avgJobValue: technician.jobCount && technician.jobCount > 0 
      ? (technician.totalRevenue || 0) / technician.jobCount 
      : 0
  };
};

// Calculate technician financials based on jobs and date range
export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
) => {
  return technicians.map(tech => {
    // Filter jobs for this technician within date range
    const techJobs = jobs.filter(job => {
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date);
      const isInDateRange = 
        (!dateRange?.from || jobDate >= dateRange.from) && 
        (!dateRange?.to || jobDate <= dateRange.to);
      
      return job.technicianId === tech.id && isInDateRange;
    });
    
    // Calculate metrics
    const totalRevenue = techJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount), 0);
    const completedJobs = techJobs.filter(job => job.status === "completed").length;
    const cancelledJobs = techJobs.filter(job => job.status === "cancelled" || job.status === "canceled").length;
    
    // Calculate earnings based on payment type
    let earnings = 0;
    if (tech.paymentType === "percentage") {
      earnings = totalRevenue * ((tech.paymentRate || 0) / 100);
    } else if (tech.paymentType === "flat") {
      earnings = completedJobs * (tech.paymentRate || 0);
    } else if (tech.paymentType === "hourly") {
      // Assuming average 2 hours per job for calculation purposes
      earnings = completedJobs * 2 * (tech.hourlyRate || 0);
    }
    
    return {
      ...tech,
      totalRevenue,
      earnings,
      jobCount: techJobs.length,
      completedJobs,
      cancelledJobs
    };
  });
};

// Format date range for display
export const formatDateRangeText = (dateRange?: DateRange) => {
  if (!dateRange?.from) return "All time";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }
  
  return format(dateRange.from, "MMM d, yyyy");
};

// Ensure date range is complete with both from and to dates
export const ensureCompleteDateRange = (dateRange?: DateRange): DateRange | undefined => {
  if (!dateRange?.from) return undefined;
  
  return {
    from: dateRange.from,
    to: dateRange.to || dateRange.from
  };
};
