
import { Technician } from "@/types/technician";

/**
 * Filter technicians based on payment type and selected names
 */
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  let filtered = [...technicians];
  
  // Apply payment type filter
  if (paymentTypeFilter !== "all") {
    filtered = filtered.filter(tech => tech.paymentType === paymentTypeFilter);
  }
  
  // Apply technician name filter
  if (selectedTechnicianNames.length > 0) {
    filtered = filtered.filter(tech => selectedTechnicianNames.includes(tech.name));
  }
  
  return filtered;
};

/**
 * Toggle a technician in the filter array
 */
export const toggleTechnicianInFilter = (
  techName: string,
  currentSelection: string[]
): string[] => {
  if (currentSelection.includes(techName)) {
    return currentSelection.filter(name => name !== techName);
  } else {
    return [...currentSelection, techName];
  }
};
