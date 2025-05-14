
import { useState } from "react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { calculateContractorPayment, calculateEmployeeSalary, calculateSalesCommission } from "./financialUtils";

interface UseTechnicianFinancialsOptions {
  role?: "technician" | "salesman" | "employed" | "contractor" | "all";
  dateRange?: DateRange;
}

const useTechnicianFinancials = (options: UseTechnicianFinancialsOptions = {}) => {
  const { technicians: allTechnicians, jobs } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter technicians by role if specified
  const technicians = options.role && options.role !== "all"
    ? allTechnicians.filter((tech) => tech.role === options.role)
    : allTechnicians;
    
  // Filter jobs by date range if specified
  const filteredJobs = options.dateRange?.from || options.dateRange?.to
    ? jobs.filter(job => {
        const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date);
        const isInDateRange = 
          (!options.dateRange?.from || jobDate >= options.dateRange.from) && 
          (!options.dateRange?.to || jobDate <= options.dateRange.to);
        return isInDateRange;
      })
    : jobs;
  
  // Filter technicians by search term
  const filteredTechnicians = technicians.filter((technician) =>
    technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    technician.subRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate financial metrics based on technician role
  const technicianMetrics = filteredTechnicians.map(technician => {
    // Get jobs assigned to this technician
    const technicianJobs = filteredJobs.filter(job => job.technicianId === technician.id);
    
    switch (technician.role) {
      case "contractor":
        const payment = calculateContractorPayment(technician, technicianJobs);
        const completedJobs = technicianJobs.filter(job => job.status === "completed").length;
        const totalRevenue = technicianJobs.reduce(
          (sum, job) => sum + (job.actualAmount || job.amount), 0
        );
        
        return {
          ...technician,
          totalRevenue,
          completedJobs,
          payment,
          jobCount: technicianJobs.length,
          profit: totalRevenue - payment
        };
        
      case "employed":
        const salary = calculateEmployeeSalary(technician, options.dateRange);
        
        return {
          ...technician,
          ...salary
        };
        
      case "salesman":
        const salesMetrics = calculateSalesCommission(technician, technicianJobs);
        
        return {
          ...technician,
          ...salesMetrics,
          profit: salesMetrics.totalRevenue - salesMetrics.commission
        };
        
      default:
        return technician;
    }
  });
  
  return {
    technicians: technicianMetrics,
    searchTerm,
    setSearchTerm,
  };
};

export default useTechnicianFinancials;
