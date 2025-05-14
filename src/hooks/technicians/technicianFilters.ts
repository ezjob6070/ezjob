
import { Technician } from "@/types/technician";

// Filter technicians based on payment type and name selection
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter((tech) => {
    // Apply payment type filter
    const matchesPaymentType = 
      paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Apply technician name filter if any are selected
    const matchesNameFilter = 
      selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesNameFilter;
  });
};

// Toggle a technician name in the filter array
export const toggleTechnicianInFilter = (
  techName: string,
  currentSelectedNames: string[]
): string[] => {
  if (currentSelectedNames.includes(techName)) {
    return currentSelectedNames.filter(name => name !== techName);
  } else {
    return [...currentSelectedNames, techName];
  }
};
