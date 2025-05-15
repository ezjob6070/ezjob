
import { Technician } from "@/types/technician";
import { Job } from "@/types/job";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Calculate financial metrics for all technicians
export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => {
    // Calculate technician earnings based on payment type
    let earnings = 0;
    if (tech.paymentType === "percentage" && tech.paymentRate) {
      earnings = (tech.totalRevenue || 0) * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat" && tech.paymentRate) {
      earnings = (tech.completedJobs || 0) * tech.paymentRate;
    } else if (tech.paymentType === "hourly" && tech.hourlyRate) {
      // Estimate 2 hours per job for hourly calculations
      earnings = (tech.completedJobs || 0) * 2 * tech.hourlyRate;
    }
    return sum + earnings;
  }, 0);
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit: totalRevenue - technicianEarnings
  };
};

// Calculate metrics for a single technician
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  // Calculate earnings based on payment type
  let earnings = 0;
  if (technician.paymentType === "percentage" && technician.paymentRate) {
    earnings = (technician.totalRevenue || 0) * (technician.paymentRate / 100);
  } else if (technician.paymentType === "flat" && technician.paymentRate) {
    earnings = (technician.completedJobs || 0) * technician.paymentRate;
  } else if (technician.paymentType === "hourly" && technician.hourlyRate) {
    // Estimate 2 hours per job for hourly calculations
    earnings = (technician.completedJobs || 0) * 2 * technician.hourlyRate;
  }
  
  return {
    revenue: technician.totalRevenue || 0,
    earnings: earnings,
    companyProfit: (technician.totalRevenue || 0) - earnings,
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0,
    totalJobs: (technician.completedJobs || 0) + (technician.cancelledJobs || 0)
  };
};

// Calculate financial data for technicians based on jobs
export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
) => {
  return technicians.map(tech => {
    // Filter jobs assigned to this technician
    const techJobs = jobs.filter(job => {
      // Check if job is assigned to this technician
      const isAssigned = job.technicianId === tech.id;
      
      // Filter by date range if provided
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : 
                      job.date ? new Date(job.date) : null;
      
      const isInDateRange = !dateRange?.from || !jobDate ? true :
                           (jobDate >= dateRange.from && 
                           (!dateRange.to || jobDate <= dateRange.to));
      
      return isAssigned && isInDateRange;
    });
    
    // Calculate completed and cancelled jobs
    const completedJobs = techJobs.filter(job => job.status === "completed").length;
    const cancelledJobs = techJobs.filter(job => 
      job.status === "cancelled" || job.status === "canceled"
    ).length;
    
    // Calculate revenue from completed jobs
    const totalRevenue = techJobs
      .filter(job => job.status === "completed")
      .reduce((sum, job) => sum + (job.actualAmount || job.amount), 0);
    
    // Return technician with calculated financial metrics
    return {
      ...tech,
      completedJobs,
      cancelledJobs,
      totalRevenue,
      jobCount: techJobs.length
    };
  });
};

// Format date range as text
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

// Ensure complete date range
export const ensureCompleteDateRange = (dateRange?: DateRange) => {
  if (!dateRange?.from) {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return { from: monthAgo, to: today };
  }
  
  return {
    from: dateRange.from,
    to: dateRange.to || dateRange.from
  };
};
