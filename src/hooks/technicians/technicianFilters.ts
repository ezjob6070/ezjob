
import { Technician } from "@/types/technician";

// Filter technicians based on payment type and name selection
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(tech => {
    const paymentTypeMatch = paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
      
    const nameMatch = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
      
    return paymentTypeMatch && nameMatch;
  });
};

// Toggle a technician in the filter array
export const toggleTechnicianInFilter = (
  techName: string,
  selectedTechs: string[]
): string[] => {
  if (selectedTechs.includes(techName)) {
    return selectedTechs.filter(name => name !== techName);
  } else {
    return [...selectedTechs, techName];
  }
};
