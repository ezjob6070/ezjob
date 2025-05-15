
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";

export const ensureCompleteDateRange = (dateRange?: DateRange): DateRange | undefined => {
  if (!dateRange) {
    return undefined;
  }
  
  // If no end date, use the start date as the end date
  if (dateRange.from && !dateRange.to) {
    return {
      from: dateRange.from,
      to: dateRange.from
    };
  }
  
  return dateRange;
};

export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
): Technician[] => {
  const range = ensureCompleteDateRange(dateRange);
  
  return technicians.map(tech => {
    // Filter jobs for this technician
    const techJobs = jobs.filter(job => {
      // Match by technician ID
      const belongsToTechnician = job.technicianId === tech.id;
      
      // Check if job is within date range
      let inDateRange = true;
      if (range?.from && range?.to && job.scheduledDate) {
        const jobDate = new Date(job.scheduledDate);
        inDateRange = jobDate >= range.from && jobDate <= range.to;
      }
      
      return belongsToTechnician && inDateRange;
    });
    
    // Count jobs by status
    const completedJobs = techJobs.filter(job => job.status === "completed").length;
    const cancelledJobs = techJobs.filter(job => job.status === "cancelled" || job.status === "canceled").length;
    
    // Calculate revenue from completed jobs
    const totalRevenue = techJobs
      .filter(job => job.status === "completed")
      .reduce((sum, job) => sum + (job.actualAmount || job.amount), 0);
    
    // Calculate earnings based on payment type
    let earnings = 0;
    if (tech.paymentType === "percentage") {
      earnings = totalRevenue * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat") {
      earnings = completedJobs * tech.paymentRate;
    } else if (tech.paymentType === "hourly") {
      // Assume 2 hours per job for estimation
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

export const getTechnicianFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const totalEarnings = technicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
  const totalJobs = technicians.reduce((sum, tech) => sum + (tech.jobCount || 0), 0);
  const completedJobs = technicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
  
  return {
    totalRevenue,
    totalEarnings,
    companyProfit: totalRevenue - totalEarnings,
    totalJobs,
    completedJobs,
    averageJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0
  };
};
