
import { Technician } from "@/types/technician";
import { Job } from "@/components/jobs/JobTypes";

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

export const calculateTechnicianMetrics = (technician: Technician, jobs: Job[]) => {
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
