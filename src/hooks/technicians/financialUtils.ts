
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";

// Ensure that a date range has both 'from' and 'to' defined
export const ensureCompleteDateRange = (range?: DateRange): DateRange => {
  if (!range) {
    const today = new Date();
    return {
      from: today,
      to: today
    };
  }
  
  if (!range.from) {
    range.from = new Date();
  }
  
  if (!range.to) {
    range.to = range.from;
  }
  
  return range;
};

// Calculate financial metrics for technicians based on their jobs
export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
): Technician[] => {
  // Ensure we have a complete date range
  const filteredDateRange = ensureCompleteDateRange(dateRange);
  
  // Make a copy of technicians to add financial data
  return technicians.map(technician => {
    // Get all jobs for this technician in the date range
    const technicianJobs = jobs.filter(job => {
      // Match technician
      const isForTechnician = job.technicianId === technician.id;
      
      // Check date range
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : 
                    job.date ? new Date(job.date) : null;
      
      if (!jobDate) return false;
      
      const isInDateRange = (!filteredDateRange.from || jobDate >= filteredDateRange.from) && 
                          (!filteredDateRange.to || jobDate <= filteredDateRange.to);
                          
      return isForTechnician && isInDateRange;
    });
    
    // Calculate technician metrics
    const completedJobs = technicianJobs.filter(job => job.status === "completed");
    const cancelledJobs = technicianJobs.filter(job => 
      job.status === "cancelled" || job.status === "canceled");
    
    const totalRevenue = completedJobs.reduce((sum, job) => 
      sum + (job.actualAmount || job.amount), 0);
    
    // Calculate earnings based on payment type
    let earnings = 0;
    
    if (technician.paymentType === "percentage") {
      earnings = totalRevenue * (technician.paymentRate / 100);
    } else if (technician.paymentType === "flat") {
      earnings = completedJobs.length * technician.paymentRate;
    } else if (technician.paymentType === "hourly") {
      // Assume average 2 hours per job for calculation
      earnings = completedJobs.length * 2 * (technician.hourlyRate || 0);
    }
    
    // Return the technician with added metrics
    return {
      ...technician,
      totalRevenue,
      earnings,
      completedJobs: completedJobs.length,
      cancelledJobs: cancelledJobs.length,
      jobCount: technicianJobs.length
    };
  });
};
