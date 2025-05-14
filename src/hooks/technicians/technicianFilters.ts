
import { Technician } from "@/types/technician";

/**
 * Filter technicians based on payment type and selected names
 */
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  // Start with all technicians
  let filtered = [...technicians];
  
  // Apply payment type filter if it's not "all"
  if (paymentTypeFilter !== "all") {
    filtered = filtered.filter(tech => tech.paymentType === paymentTypeFilter);
  }
  
  // Apply selected technician names filter if any are selected
  if (selectedTechnicianNames.length > 0) {
    filtered = filtered.filter(tech => selectedTechnicianNames.includes(tech.name));
  }
  
  return filtered;
};

/**
 * Toggle a technician in a filter list
 */
export const toggleTechnicianInFilter = (
  techName: string,
  currentlySelected: string[]
): string[] => {
  if (currentlySelected.includes(techName)) {
    // Remove if already selected
    return currentlySelected.filter(name => name !== techName);
  } else {
    // Add if not already selected
    return [...currentlySelected, techName];
  }
};

/**
 * Filter technicians based on role type
 */
export const filterTechniciansByRole = (
  technicians: Technician[],
  roleFilter: string
): Technician[] => {
  if (roleFilter === "all") {
    return technicians; // Return all technicians if "all" is selected
  }
  
  return technicians.filter(tech => tech.role === roleFilter);
};

/**
 * Filter technicians based on sub-role
 */
export const filterTechniciansBySubRole = (
  technicians: Technician[],
  subRoleFilter: string | null
): Technician[] => {
  if (!subRoleFilter) {
    return technicians; // Return all technicians if no sub-role filter
  }
  
  return technicians.filter(tech => tech.subRole === subRoleFilter);
};
