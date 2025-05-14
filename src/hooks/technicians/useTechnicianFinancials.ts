
import { useMemo } from "react";
import { Technician } from "@/types/technician";
import { calculateMonthlySalary, calculateTechnicianPayment } from "./financialUtils";

export interface TechnicianFinancials {
  monthlySalary: number;
  periodPayment: number;
  commission?: number;
  profit?: number;
  completedJobs?: number;
  totalRevenue?: number;
  salesCount?: number;
  averageSaleValue?: number;
  jobCount?: number;
}

interface UseTechnicianFinancialsOptions {
  periodDays?: number;
}

/**
 * Calculate financial metrics for technicians
 */
export default function useTechnicianFinancials(
  technicians: Technician[],
  jobs: any[] = [], // Using any for now, should be typed properly
  options: UseTechnicianFinancialsOptions = {}
) {
  const { periodDays = 30 } = options;
  
  const technicianFinancials = useMemo(() => {
    return technicians.map(technician => {
      // Filter jobs for this technician
      const techJobs = jobs.filter(job => {
        // Check if technicianId exists and matches
        if (!job.technicianId) return false;
        return job.technicianId === technician.id;
      });
      
      // Calculate basic job stats
      const completedJobs = techJobs.filter(job => job.status === "completed").length;
      const totalRevenue = techJobs.reduce((sum, job) => 
        sum + (job.actualAmount || job.amount || 0), 0
      );
      
      // Calculate monthly salary
      const monthlySalary = calculateMonthlySalary(technician);
      
      // Calculate period payment (for the selected time period)
      let periodPayment = (monthlySalary / 30) * periodDays;
      
      // Add incentives if applicable
      if (technician.incentiveType && technician.incentiveAmount) {
        if (technician.incentiveType === "monthly") {
          periodPayment += technician.incentiveAmount * (periodDays / 30);
        } else if (technician.incentiveType === "yearly") {
          periodPayment += (technician.incentiveAmount / 365) * periodDays;
        }
      }
      
      // Calculate commission based on role and payment type
      let commission = 0;
      let salesCount = 0;
      let profit = 0;
      
      if (technician.role === "salesman") {
        salesCount = completedJobs;
        commission = calculateTechnicianPayment(technician, totalRevenue, completedJobs);
        profit = totalRevenue - commission;
      } else if (technician.role === "contractor") {
        commission = calculateTechnicianPayment(technician, totalRevenue, completedJobs);
        profit = totalRevenue - commission;
      }
      
      const averageSaleValue = salesCount > 0 ? totalRevenue / salesCount : 0;
      
      return {
        ...technician,
        monthlySalary,
        periodPayment,
        commission,
        profit,
        completedJobs: technician.completedJobs || completedJobs,
        totalRevenue: technician.totalRevenue || totalRevenue,
        salesCount,
        averageSaleValue,
        jobCount: techJobs.length
      };
    });
  }, [technicians, jobs, periodDays]);
  
  return technicianFinancials;
}
