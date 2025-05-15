
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
