
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export const calculateTechnicianEarnings = (technician: Technician, jobs: Job[]): number => {
  const completedJobs = jobs.filter(job => 
    job.technicianId === technician.id && 
    job.status === "completed"
  );
  
  let earnings = 0;
  
  if (technician.paymentType === "percentage") {
    earnings = completedJobs.reduce((total, job) => {
      const jobAmount = job.actualAmount || job.amount;
      return total + (jobAmount * (technician.paymentRate / 100));
    }, 0);
  } else if (technician.paymentType === "flat") {
    earnings = completedJobs.length * technician.paymentRate;
  } else if (technician.paymentType === "hourly") {
    // Assuming an average of 2 hours per job for calculation purposes
    earnings = completedJobs.length * 2 * technician.hourlyRate;
  } else if (technician.paymentType === "salary") {
    // For salaried technicians, earnings are calculated differently
    // Here we just return their monthly salary if available
    earnings = technician.monthlySalary || 0;
  }
  
  return earnings;
};

export const calculateTechnicianProfit = (technician: Technician, jobs: Job[]): number => {
  const completedJobs = jobs.filter(job => 
    job.technicianId === technician.id && 
    job.status === "completed"
  );
  
  const totalRevenue = completedJobs.reduce((total, job) => 
    total + (job.actualAmount || job.amount), 0);
    
  const earnings = calculateTechnicianEarnings(technician, jobs);
  
  return totalRevenue - earnings;
};

export const calculateTechnicianMetrics = (technician: Technician, jobs: Job[] = []) => {
  if (!technician) return {
    totalJobs: 0,
    completedJobs: 0,
    cancelledJobs: 0,
    completionRate: 0,
    totalRevenue: 0,
    earnings: 0,
    profit: 0,
    averageJobValue: 0
  };
  
  const techJobs = jobs.filter(job => job.technicianId === technician.id);
  const completedJobs = techJobs.filter(job => job.status === "completed");
  const cancelledJobs = techJobs.filter(job => job.status === "cancelled");
  
  const totalRevenue = completedJobs.reduce((sum, job) => 
    sum + (job.actualAmount || job.amount), 0);
    
  const earnings = calculateTechnicianEarnings(technician, jobs);
  const profit = totalRevenue - earnings;
  
  return {
    totalJobs: techJobs.length,
    completedJobs: completedJobs.length,
    cancelledJobs: cancelledJobs.length,
    completionRate: techJobs.length > 0 ? 
      (completedJobs.length / techJobs.length) * 100 : 0,
    totalRevenue,
    earnings,
    profit,
    averageJobValue: completedJobs.length > 0 ? 
      totalRevenue / completedJobs.length : 0
  };
};

export const calculateFinancialMetrics = (technicians: Technician[] = [], jobs: Job[] = []) => {
  // Calculate total revenue across all technicians
  const totalRevenue = technicians.reduce((sum, tech) => {
    const techJobs = jobs.filter(job => 
      job.technicianId === tech.id && 
      job.status === "completed"
    );
    
    const techRevenue = techJobs.reduce((jobSum, job) => 
      jobSum + (job.actualAmount || job.amount), 0);
    
    return sum + techRevenue;
  }, 0);
  
  // Calculate total technician earnings
  const technicianEarnings = technicians.reduce((sum, tech) => 
    sum + calculateTechnicianEarnings(tech, jobs), 0);
  
  // Calculate company profit
  const companyProfit = totalRevenue - technicianEarnings;
  
  // Calculate job metrics
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const pendingJobs = jobs.filter(job => job.status === "pending").length;
  const cancelledJobs = jobs.filter(job => job.status === "cancelled").length;
  
  // Calculate average job value
  const averageJobValue = completedJobs > 0 
    ? totalRevenue / completedJobs 
    : 0;
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit,
    totalJobs,
    completedJobs,
    pendingJobs,
    cancelledJobs,
    averageJobValue
  };
};

export const formatDateRangeText = (dateRange?: DateRange): string => {
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
