
import { Technician } from "@/types/technician";

// Filter technicians by payment type and name
export const filterTechnicians = (
  technicians: Technician[], 
  paymentTypeFilter: string, 
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(tech => {
    // Filter by payment type
    const matchesPaymentType = paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Filter by technician name
    const matchesName = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesName;
  });
};

// Helper function to toggle a technician name in a filter list
export const toggleTechnicianInFilter = (
  technicianName: string, 
  currentList: string[]
): string[] => {
  if (currentList.includes(technicianName)) {
    return currentList.filter(name => name !== technicianName);
  } else {
    return [...currentList, technicianName];
  }
};
