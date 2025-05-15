
import { Technician, TechnicianFilters } from "@/types/technician";
import { isSameMonth, isAfter, isBefore, isWithinInterval } from "date-fns";

export const filterTechnicians = (
  technicians: Technician[], 
  filters: TechnicianFilters
): Technician[] => {
  return technicians.filter(technician => {
    // Search filter
    if (filters.search && !technician.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !technician.email.toLowerCase().includes(filters.search.toLowerCase()) && 
        !technician.phone?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !technician.specialty?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Payment type filter
    if (filters.paymentTypes.length > 0 && !filters.paymentTypes.includes(technician.paymentType)) {
      return false;
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(technician.status)) {
      return false;
    }
    
    // Categories filter
    if (filters.categories.length > 0 && 
        (!technician.category || !filters.categories.includes(technician.category))) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const hireDate = new Date(technician.hireDate);
      if (!isWithinInterval(hireDate, { 
        start: filters.dateRange.from, 
        end: filters.dateRange.to 
      })) {
        return false;
      }
    }
    
    return true;
  });
};

export const toggleTechnicianInFilter = (
  technicianId: string, 
  selectedTechnicians: string[]
): string[] => {
  if (selectedTechnicians.includes(technicianId)) {
    return selectedTechnicians.filter(id => id !== technicianId);
  } else {
    return [...selectedTechnicians, technicianId];
  }
};
