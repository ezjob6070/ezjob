
import { Technician } from "@/types/technician";

/**
 * Calculate total financial metrics for all technicians
 */
export const calculateFinancialMetrics = (displayedTechnicians: Technician[]) => {
  // Calculate total revenue from technicians
  const totalRevenue = displayedTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Calculate total technician payments
  const technicianEarnings = displayedTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  
  return { 
    totalRevenue, 
    technicianEarnings, 
    totalExpenses, 
    companyProfit 
  };
};

/**
 * Calculate financial metrics for a single technician
 */
export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  const revenue = technician.totalRevenue;
  const earnings = revenue * (technician.paymentType === "percentage" 
    ? technician.paymentRate / 100 
    : 1);
  const expenses = revenue * 0.33;
  const profit = revenue - earnings - expenses;
  const partsValue = revenue * 0.2; // Assuming parts are 20% of total revenue
  
  return { revenue, earnings, expenses, profit, partsValue };
};

/**
 * Format date range for display
 */
export const formatDateRangeText = (from?: Date, to?: Date) => {
  if (!from) return "";
  
  return to
    ? `${formatDate(from)} - ${formatDate(to)}`
    : formatDate(from);
};

/**
 * Format date for display
 */
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
