
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";

export interface TechnicianFilterOptions {
  role?: string;
  paymentType?: string;
  status?: string;
  specialty?: string;
  dateRange?: DateRange;
}

export const filterTechnicians = (
  technicians: Technician[], 
  options: TechnicianFilterOptions
): Technician[] => {
  return technicians.filter(tech => {
    // Filter by role
    if (options.role && options.role !== "all" && tech.role !== options.role) {
      return false;
    }
    
    // Filter by payment type
    if (options.paymentType && options.paymentType !== "all" && tech.paymentType !== options.paymentType) {
      return false;
    }
    
    // Filter by status
    if (options.status && options.status !== "all" && tech.status !== options.status) {
      return false;
    }
    
    // Filter by specialty
    if (options.specialty && options.specialty !== "all" && tech.specialty !== options.specialty) {
      return false;
    }

    return true;
  });
};

export const searchTechnicians = (technicians: Technician[], query: string): Technician[] => {
  if (!query || query.trim() === "") {
    return technicians;
  }
  
  const lowercaseQuery = query.toLowerCase();
  
  return technicians.filter(tech => 
    tech.name.toLowerCase().includes(lowercaseQuery) ||
    tech.email.toLowerCase().includes(lowercaseQuery) ||
    (tech.phone && tech.phone.toLowerCase().includes(lowercaseQuery)) ||
    (tech.specialty && tech.specialty.toLowerCase().includes(lowercaseQuery)) ||
    (tech.role && tech.role.toLowerCase().includes(lowercaseQuery))
  );
};

export const sortTechnicians = (
  technicians: Technician[], 
  sortOption: string = "name-asc"
): Technician[] => {
  return [...technicians].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "revenue-high":
        return (b.totalRevenue || 0) - (a.totalRevenue || 0);
      case "revenue-low":
        return (a.totalRevenue || 0) - (b.totalRevenue || 0);
      case "jobs-high":
        return (b.jobCount || 0) - (a.jobCount || 0);
      case "jobs-low":
        return (a.jobCount || 0) - (b.jobCount || 0);
      case "newest":
        return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
      case "oldest":
        return new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
      default:
        return 0;
    }
  });
};
