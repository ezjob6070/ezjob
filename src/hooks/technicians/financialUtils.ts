
import { DateRange } from "react-day-picker";
import { Job } from "@/types/job";
import { Technician } from "@/types/technician";

/**
 * Safely handles DateRange by ensuring both from and to properties exist
 * @param dateRange Optional DateRange object
 * @returns Object with from and to dates, or undefined if not complete
 */
export const ensureCompleteDateRange = (dateRange?: DateRange): { from: Date; to: Date } | undefined => {
  if (!dateRange?.from || !dateRange?.to) return undefined;
  return { from: dateRange.from, to: dateRange.to };
};

/**
 * Converts a date string or Date object to a Date object
 * @param date Date string or Date object
 * @returns Date object or undefined if input is invalid
 */
export const toDateObject = (date: string | Date | undefined): Date | undefined => {
  if (!date) return undefined;
  return typeof date === 'string' ? new Date(date) : date;
};

/**
 * Calculates financial metrics for technicians based on jobs
 * @param technicians Array of technicians
 * @param jobs Array of jobs
 * @param dateRange Optional date range to filter jobs
 * @returns Technicians with financial metrics
 */
export const calculateTechnicianFinancials = (
  technicians: Technician[],
  jobs: Job[],
  dateRange?: DateRange
): Technician[] => {
  return technicians.map(technician => {
    // Filter jobs for this technician within date range
    const techJobs = jobs.filter(job => {
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date);
      const isInDateRange = 
        (!dateRange?.from || jobDate >= dateRange.from) && 
        (!dateRange?.to || jobDate <= dateRange.to);
      
      return isInDateRange && job.technicianId === technician.id;
    });
    
    // Calculate financial metrics based on technician's role and payment structure
    const totalRevenue = techJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount), 0);
    const completedJobs = techJobs.filter(job => job.status === "completed").length;
    
    let earnings = 0;
    if (technician.role === "contractor") {
      if (technician.paymentType === "percentage" && technician.paymentRate) {
        earnings = totalRevenue * (technician.paymentRate / 100);
      } else if (technician.paymentType === "flat" && technician.paymentRate) {
        earnings = completedJobs * technician.paymentRate;
      } else if (technician.paymentType === "hourly" && technician.hourlyRate) {
        // Assuming average 2 hours per job for calculation purposes
        earnings = completedJobs * 2 * technician.hourlyRate;
      }
    } else if (technician.role === "salesman") {
      if (technician.incentiveType === "commission" && technician.incentiveAmount) {
        earnings = totalRevenue * (technician.incentiveAmount / 100);
      } else if (technician.paymentType === "percentage" && technician.paymentRate) {
        earnings = totalRevenue * (technician.paymentRate / 100);
      } else if (technician.paymentType === "flat" && technician.paymentRate) {
        earnings = completedJobs * technician.paymentRate;
      }
    }
    
    return {
      ...technician,
      totalRevenue,
      earnings,
      jobCount: techJobs.length,
      completedJobs
    };
  });
};

/**
 * Formats job types for filtering
 * @param jobs Array of jobs
 * @returns Array of unique job types with counts
 */
export const getJobTypeFilters = (jobs: Job[]) => {
  const types: { [key: string]: number } = {};
  
  jobs.forEach(job => {
    const type = job.serviceType || 'Unknown';
    types[type] = (types[type] || 0) + 1;
  });
  
  return Object.keys(types).map(key => ({
    name: key,
    count: types[key]
  }));
};

/**
 * Formats sources for filtering
 * @param jobs Array of jobs
 * @returns Array of unique sources with counts
 */
export const getJobSourceFilters = (jobs: Job[]) => {
  const sources: { [key: string]: number } = {};
  
  jobs.forEach(job => {
    const source = job.source || job.jobSourceName || 'Unknown';
    sources[source] = (sources[source] || 0) + 1;
  });
  
  return Object.keys(sources).map(key => ({
    name: key,
    count: sources[key]
  }));
};
