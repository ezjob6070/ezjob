
import { Technician } from "@/types/technician";

// Filter technicians based on payment type and selected names
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(tech => {
    // Filter by payment type
    const matchesPaymentType = paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Filter by selected technician names
    const matchesSelectedNames = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesSelectedNames;
  });
};

// Toggle a technician name in the filter array
export const toggleTechnicianInFilter = (
  techName: string, 
  currentSelected: string[]
): string[] => {
  if (currentSelected.includes(techName)) {
    return currentSelected.filter(name => name !== techName);
  } else {
    return [...currentSelected, techName];
  }
};

// Group technicians by a property
export const groupTechniciansBy = <K extends keyof Technician>(
  technicians: Technician[],
  key: K
): Record<string, Technician[]> => {
  const grouped: Record<string, Technician[]> = {};
  
  technicians.forEach(tech => {
    const value = tech[key];
    const strValue = value?.toString() || 'other';
    
    if (!grouped[strValue]) {
      grouped[strValue] = [];
    }
    
    grouped[strValue].push(tech);
  });
  
  return grouped;
};

// Sort technicians by different criteria
export const sortTechnicians = (
  technicians: Technician[],
  sortBy: string
): Technician[] => {
  const sortedTechs = [...technicians];
  
  switch (sortBy) {
    case 'name-asc':
      return sortedTechs.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedTechs.sort((a, b) => b.name.localeCompare(a.name));
    case 'revenue-high':
      return sortedTechs.sort((a, b) => 
        (b.totalRevenue || 0) - (a.totalRevenue || 0)
      );
    case 'revenue-low':
      return sortedTechs.sort((a, b) => 
        (a.totalRevenue || 0) - (b.totalRevenue || 0)
      );
    case 'jobs-high':
      return sortedTechs.sort((a, b) => 
        (b.completedJobs || 0) - (a.completedJobs || 0)
      );
    case 'jobs-low':
      return sortedTechs.sort((a, b) => 
        (a.completedJobs || 0) - (b.completedJobs || 0)
      );
    case 'hire-date-new':
      return sortedTechs.sort((a, b) => 
        new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
      );
    case 'hire-date-old':
      return sortedTechs.sort((a, b) => 
        new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime()
      );
    default:
      return sortedTechs;
  }
};
