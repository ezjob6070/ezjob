
import { Technician } from "@/types/technician";

/**
 * Filters technicians based on payment type and name selection
 */
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(technician => {
    // Filter by payment type
    const matchesPaymentType = paymentTypeFilter === "all" || 
      technician.paymentType === paymentTypeFilter;
      
    // Filter by technician name if any are selected
    const matchesTechnicianFilter = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(technician.name);
      
    return matchesPaymentType && matchesTechnicianFilter;
  });
};

/**
 * Toggles a technician name in the filter array
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
