
import { Technician } from "@/types/technician";

// Filter technicians based on payment type and selected names
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  // First filter by payment type
  let filteredByType = technicians;
  if (paymentTypeFilter !== "all") {
    filteredByType = technicians.filter(tech => 
      tech.paymentType === paymentTypeFilter
    );
  }
  
  // Then filter by selected names if any
  if (selectedTechnicianNames.length > 0) {
    return filteredByType.filter(tech => 
      selectedTechnicianNames.includes(tech.name)
    );
  }
  
  return filteredByType;
};

// Toggle a technician in the filter list
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
