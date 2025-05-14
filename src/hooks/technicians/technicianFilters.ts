
import { Technician } from "@/types/technician";

/**
 * Filter technicians by their role
 * @param technicians List of technicians
 * @param role Role to filter by
 * @returns Filtered list of technicians
 */
export function filterTechniciansByRole(technicians: Technician[], role: string): Technician[] {
  if (role === "all") {
    return technicians;
  }
  
  return technicians.filter(tech => (tech.role || "technician") === role);
}

/**
 * Filter technicians by search term across multiple fields
 * @param technicians List of technicians
 * @param searchTerm Search term
 * @returns Filtered list of technicians
 */
export function filterTechniciansBySearchTerm(technicians: Technician[], searchTerm: string): Technician[] {
  if (!searchTerm) {
    return technicians;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return technicians.filter(tech => 
    tech.name.toLowerCase().includes(lowerSearchTerm) ||
    tech.email.toLowerCase().includes(lowerSearchTerm) ||
    (tech.phone || "").toLowerCase().includes(lowerSearchTerm) ||
    (tech.specialty || "").toLowerCase().includes(lowerSearchTerm) ||
    (tech.position || "").toLowerCase().includes(lowerSearchTerm) ||
    (tech.subRole || "").toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Get a list of technicians filtered by their role
 * @param technicians List of all technicians
 * @param role Role to filter by
 * @param searchTerm Optional search term to further filter results
 * @returns Filtered list of technicians
 */
export function getTechniciansByRole(
  technicians: Technician[], 
  role: string, 
  searchTerm: string = ""
): Technician[] {
  const techsByRole = filterTechniciansByRole(technicians, role);
  
  if (!searchTerm) {
    return techsByRole;
  }
  
  return filterTechniciansBySearchTerm(techsByRole, searchTerm);
}
