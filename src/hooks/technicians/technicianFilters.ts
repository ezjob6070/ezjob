
import { Technician } from "@/types/technician";

/**
 * Filter technicians based on payment type and selected names
 */
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(tech => {
    // Apply payment type filter
    const matchesPaymentType = 
      paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Apply technician name filter if any names are selected
    const matchesName = 
      selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesName;
  });
};

/**
 * Toggle a technician name in a filter array
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

/**
 * Select all technicians for filtering
 */
export const selectAllTechnicians = (
  technicians: Technician[]
): string[] => {
  return technicians.map(tech => tech.name);
};

/**
 * Clear all technician selections
 */
export const clearTechnicianSelection = (): string[] => {
  return [];
};
