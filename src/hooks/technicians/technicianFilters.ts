import { Technician } from "@/types/technician";

export const filterTechniciansByRole = (
  technicians: Technician[],
  roleFilter: string
): Technician[] => {
  if (roleFilter === "all") return technicians;
  return technicians.filter(tech => (tech.role || "technician") === roleFilter);
};

export const filterTechniciansBySubRole = (
  technicians: Technician[],
  subRoleFilter: string | null
): Technician[] => {
  if (!subRoleFilter) return technicians;
  return technicians.filter(tech => tech.subRole === subRoleFilter);
};

export const filterTechniciansByStatus = (
  technicians: Technician[],
  statusFilter: string
): Technician[] => {
  if (statusFilter === "all") return technicians;
  return technicians.filter(tech => tech.status === statusFilter);
};

export const filterTechniciansBySearch = (
  technicians: Technician[],
  searchQuery: string
): Technician[] => {
  if (!searchQuery) return technicians;
  
  const query = searchQuery.toLowerCase();
  return technicians.filter(tech => {
    return (
      tech.name.toLowerCase().includes(query) ||
      (tech.email && tech.email.toLowerCase().includes(query)) ||
      (tech.phone && tech.phone.toLowerCase().includes(query)) ||
      (tech.specialty && tech.specialty.toLowerCase().includes(query))
    );
  });
};

export const getUniqueSubRoles = (technicians: Technician[]): string[] => {
  const subRoles = technicians
    .map(tech => tech.subRole)
    .filter(Boolean) as string[];
  
  return [...new Set(subRoles)];
};

// Add the missing filterTechnicians function
export const filterTechnicians = (
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] => {
  let filtered = [...technicians];
  
  // Filter by payment type if not "all"
  if (paymentTypeFilter !== "all") {
    filtered = filtered.filter(tech => tech.paymentType === paymentTypeFilter);
  }
  
  // Filter by selected technician names if any are selected
  if (selectedTechnicianNames.length > 0) {
    filtered = filtered.filter(tech => selectedTechnicianNames.includes(tech.name));
  }
  
  return filtered;
};

// Add the missing toggleTechnicianInFilter function
export const toggleTechnicianInFilter = (
  techName: string,
  selectedTechnicianNames: string[]
): string[] => {
  // If the technician is already selected, remove them
  if (selectedTechnicianNames.includes(techName)) {
    return selectedTechnicianNames.filter(name => name !== techName);
  }
  
  // Otherwise add them to the selected list
  return [...selectedTechnicianNames, techName];
};
