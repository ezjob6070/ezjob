
import { Technician } from "@/types/technician";
import { Job } from "@/types/job";
import { DateRange } from "react-day-picker";

export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
): Technician[] => {
  return technicians.map(tech => {
    // Filter jobs assigned to this technician within date range
    const techJobs = jobs.filter(job => {
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date as string);
      const isInDateRange = 
        (!dateRange?.from || jobDate >= dateRange.from) && 
        (!dateRange?.to || jobDate <= dateRange.to);
      
      return isInDateRange && job.technicianId === tech.id;
    });
    
    // Calculate metrics
    const totalRevenue = techJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount), 0);
    const completedJobs = techJobs.filter(job => job.status === "completed").length;
    const cancelledJobs = techJobs.filter(job => job.status === "cancelled").length;
    
    // Calculate earnings based on payment type
    let earnings = 0;
    if (tech.paymentType === "percentage") {
      earnings = totalRevenue * (tech.paymentRate / 100);
    } else if (tech.paymentType === "flat") {
      earnings = completedJobs * tech.paymentRate;
    } else if (tech.paymentType === "hourly" && tech.hourlyRate) {
      // Assuming average 2 hours per job for simplicity
      earnings = completedJobs * 2 * tech.hourlyRate;
    }
    
    return {
      ...tech,
      totalRevenue,
      completedJobs,
      cancelledJobs,
      earnings,
      jobCount: techJobs.length
    };
  });
};

export const ensureCompleteDateRange = (dateRange?: DateRange): DateRange | undefined => {
  if (!dateRange) return undefined;
  
  // If only from is specified, set to to today
  if (dateRange.from && !dateRange.to) {
    return {
      from: dateRange.from,
      to: new Date()
    };
  }
  
  return dateRange;
};
