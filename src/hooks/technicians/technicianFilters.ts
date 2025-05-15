
import { Technician } from "@/types/technician";

// Filter technicians by a search query
export const filterTechnicians = (
  technicians: Technician[],
  searchQuery: string,
  selectedTechnicians: string[] = [],
  roleFilter: string = "all",
  statusFilter: string = "all",
  subRoleFilter: string | null = null,
) => {
  // Start with the role filter
  const filteredByRole = roleFilter === "all" 
    ? technicians 
    : technicians.filter(tech => tech.role === roleFilter);

  // Then filter by status if applicable
  const filteredByStatus = statusFilter === "all"
    ? filteredByRole
    : filteredByRole.filter(tech => tech.status === statusFilter);

  // Then filter by selected technicians if any are selected
  const filteredBySelection = selectedTechnicians.length > 0
    ? filteredByStatus.filter(tech => selectedTechnicians.includes(tech.id))
    : filteredByStatus;

  // Then filter by sub-role if applicable
  const filteredBySubRole = subRoleFilter
    ? filteredBySelection.filter(tech => tech.subRole === subRoleFilter)
    : filteredBySelection;

  // Finally filter by search query
  if (!searchQuery) return filteredBySubRole;

  const query = searchQuery.toLowerCase().trim();
  return filteredBySubRole.filter(tech => {
    const name = tech.name?.toLowerCase() || "";
    const email = tech.email?.toLowerCase() || "";
    const phone = tech.phone?.toLowerCase() || "";
    const specialty = tech.specialty?.toLowerCase() || "";
    
    return name.includes(query) || 
           email.includes(query) || 
           phone.includes(query) || 
           specialty.includes(query);
  });
};

// Toggle selection of a technician in a selected technicians array
export const toggleTechnicianInFilter = (
  technicianId: string,
  selectedTechnicians: string[],
): string[] => {
  if (selectedTechnicians.includes(technicianId)) {
    return selectedTechnicians.filter(id => id !== technicianId);
  } else {
    return [...selectedTechnicians, technicianId];
  }
};
