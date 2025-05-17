
import { Technician } from "@/types/technician";

/**
 * Filter technicians based on payment type and selected names
 */
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
) => {
  // Ensure technicians is not null or undefined
  if (!technicians || technicians.length === 0) {
    return [];
  }

  return technicians.filter(tech => {
    // Ensure tech is not null before accessing properties
    if (!tech) return false;
    
    // Filter by payment type
    const matchesPaymentType = 
      paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Filter by selected technicians
    const matchesTechnician = 
      selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesTechnician;
  });
};

/**
 * Toggle technician selection in filter
 */
export const toggleTechnicianInFilter = (
  techName: string,
  selectedTechnicianNames: string[]
) => {
  if (!techName) return selectedTechnicianNames;
  
  return selectedTechnicianNames.includes(techName) 
    ? selectedTechnicianNames.filter(t => t !== techName)
    : [...selectedTechnicianNames, techName];
};
