
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";

export interface TechnicianFilters {
  search: string;
  paymentTypes: string[];
  status: string[];
  categories: string[];
  role?: string;
  dateRange?: DateRange;
}

export const filterTechniciansByRole = (technicians: Technician[], role: string): Technician[] => {
  if (role === "all") return technicians;
  return technicians.filter(tech => tech.role === role);
};

export const filterTechniciansBySearch = (technicians: Technician[], searchTerm: string): Technician[] => {
  if (!searchTerm) return technicians;
  
  const lowerCaseSearch = searchTerm.toLowerCase();
  return technicians.filter(tech => 
    tech.name.toLowerCase().includes(lowerCaseSearch) ||
    tech.email.toLowerCase().includes(lowerCaseSearch) ||
    tech.specialty?.toLowerCase().includes(lowerCaseSearch) ||
    tech.position?.toLowerCase().includes(lowerCaseSearch) ||
    tech.subRole?.toLowerCase().includes(lowerCaseSearch) ||
    tech.phone?.toLowerCase().includes(lowerCaseSearch)
  );
};

export const filterTechniciansByStatus = (technicians: Technician[], statusFilter: string[]): Technician[] => {
  if (!statusFilter.length) return technicians;
  return technicians.filter(tech => statusFilter.includes(tech.status));
};

export const filterTechniciansByPaymentType = (technicians: Technician[], paymentTypes: string[]): Technician[] => {
  if (!paymentTypes.length) return technicians;
  return technicians.filter(tech => paymentTypes.includes(tech.paymentType));
};

export const filterTechniciansByDateRange = (
  technicians: Technician[], 
  dateRange?: DateRange
): Technician[] => {
  if (!dateRange || !dateRange.from) return technicians;
  
  return technicians.filter(tech => {
    const hireDate = new Date(tech.hireDate);
    
    if (dateRange.to) {
      return hireDate >= dateRange.from && hireDate <= dateRange.to;
    }
    
    return hireDate >= dateRange.from;
  });
};

export const applyTechnicianFilters = (
  technicians: Technician[],
  filters: TechnicianFilters
): Technician[] => {
  let filteredTechs = [...technicians];
  
  if (filters.search) {
    filteredTechs = filterTechniciansBySearch(filteredTechs, filters.search);
  }
  
  if (filters.paymentTypes && filters.paymentTypes.length > 0) {
    filteredTechs = filterTechniciansByPaymentType(filteredTechs, filters.paymentTypes);
  }
  
  if (filters.status && filters.status.length > 0) {
    filteredTechs = filterTechniciansByStatus(filteredTechs, filters.status);
  }
  
  if (filters.role && filters.role !== 'all') {
    filteredTechs = filterTechniciansByRole(filteredTechs, filters.role);
  }
  
  if (filters.dateRange) {
    filteredTechs = filterTechniciansByDateRange(filteredTechs, filters.dateRange);
  }
  
  return filteredTechs;
};

// Add the missing function that's being imported in useTechnicianFinancials.tsx
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  // Start with filtering by payment type
  let filtered = technicians;
  
  if (paymentTypeFilter && paymentTypeFilter !== "all") {
    filtered = filtered.filter(tech => tech.paymentType === paymentTypeFilter);
  }
  
  // Then filter by selected technician names if any are selected
  if (selectedTechnicianNames.length > 0) {
    filtered = filtered.filter(tech => selectedTechnicianNames.includes(tech.name));
  }
  
  return filtered;
};

// Add the function for toggling technicians in filters
export const toggleTechnicianInFilter = (
  techName: string,
  selectedTechnicianNames: string[]
): string[] => {
  if (selectedTechnicianNames.includes(techName)) {
    return selectedTechnicianNames.filter(name => name !== techName);
  } else {
    return [...selectedTechnicianNames, techName];
  }
};
