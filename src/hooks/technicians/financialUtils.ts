
import { Technician } from "@/types/technician";

export interface FinancialMetrics {
  totalRevenue: number;
  totalJobs: number;
  technicianEarnings: number;
  companyProfit: number;
  averageJobValue: number;
  paymentsDue: number;
}

// Calculate financial metrics for a collection of technicians
export const calculateFinancialMetrics = (technicians: Technician[]): FinancialMetrics => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const totalJobs = technicians.reduce((sum, tech) => sum + ((tech.completedJobs || 0) + (tech.cancelledJobs || 0)), 0);
  
  // Calculate technician earnings based on their payment type
  const technicianEarnings = technicians.reduce((sum, tech) => {
    switch (tech.paymentType) {
      case 'percentage':
        return sum + ((tech.totalRevenue || 0) * (tech.paymentRate || 0) / 100);
      case 'flat':
        return sum + (tech.paymentRate || 0) * (tech.completedJobs || 0);
      case 'hourly':
        // Assume an average of 2 hours per job for this calculation
        return sum + ((tech.hourlyRate || 0) * 2 * (tech.completedJobs || 0));
      case 'salary':
        // For salaried technicians, we'll just use a portion of their revenue
        return sum + ((tech.totalRevenue || 0) * 0.3); // 30% as a placeholder
      default:
        return sum;
    }
  }, 0);
  
  // Company profit is the revenue minus technician earnings
  const companyProfit = totalRevenue - technicianEarnings;
  
  // Average job value
  const averageJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
  
  // Payments due (just a placeholder calculation - in a real app this would come from actual payment data)
  const paymentsDue = totalRevenue * 0.2; // Assume 20% of revenue is still due
  
  return {
    totalRevenue,
    totalJobs,
    technicianEarnings,
    companyProfit,
    averageJobValue,
    paymentsDue
  };
};

// Calculate metrics for a single technician
export const calculateTechnicianMetrics = (technician: Technician): FinancialMetrics => {
  const totalRevenue = technician.totalRevenue || 0;
  const totalJobs = (technician.completedJobs || 0) + (technician.cancelledJobs || 0);
  
  // Calculate earnings based on payment type
  let technicianEarnings = 0;
  switch (technician.paymentType) {
    case 'percentage':
      technicianEarnings = totalRevenue * (technician.paymentRate || 0) / 100;
      break;
    case 'flat':
      technicianEarnings = (technician.paymentRate || 0) * (technician.completedJobs || 0);
      break;
    case 'hourly':
      // Assume an average of 2 hours per job
      technicianEarnings = (technician.hourlyRate || 0) * 2 * (technician.completedJobs || 0);
      break;
    case 'salary':
      // For salaried technicians, we'll just use a portion of their revenue
      technicianEarnings = totalRevenue * 0.3; // 30% as a placeholder
      break;
  }
  
  const companyProfit = totalRevenue - technicianEarnings;
  const averageJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
  const paymentsDue = totalRevenue * 0.2; // Placeholder
  
  return {
    totalRevenue,
    totalJobs,
    technicianEarnings,
    companyProfit,
    averageJobValue,
    paymentsDue
  };
};
