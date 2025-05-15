
import { Technician } from "@/types/technician";

export function filterTechnicians(
  technicians: Technician[],
  paymentTypeFilter: string,
  selectedTechnicianNames: string[]
): Technician[] {
  return technicians.filter(tech => {
    // Filter by payment type if selected
    if (paymentTypeFilter !== 'all' && tech.paymentType !== paymentTypeFilter) {
      return false;
    }
    
    // Filter by selected names if any
    if (selectedTechnicianNames.length > 0 && !selectedTechnicianNames.includes(tech.name)) {
      return false;
    }
    
    return true;
  });
}

export function toggleTechnicianInFilter(techName: string, currentlySelected: string[]): string[] {
  if (currentlySelected.includes(techName)) {
    return currentlySelected.filter(name => name !== techName);
  } else {
    return [...currentlySelected, techName];
  }
}

export function filterTechniciansByStatus(technicians: Technician[], status: string): Technician[] {
  if (status === 'all') return technicians;
  return technicians.filter(tech => tech.status === status);
}

export function filterTechniciansByRole(technicians: Technician[], role: string): Technician[] {
  if (role === 'all') return technicians;
  return technicians.filter(tech => tech.role === role);
}

export function searchTechnicians(technicians: Technician[], query: string): Technician[] {
  if (!query) return technicians;
  
  const lowerQuery = query.toLowerCase();
  return technicians.filter(tech => 
    tech.name.toLowerCase().includes(lowerQuery) ||
    tech.specialty?.toLowerCase().includes(lowerQuery) ||
    tech.email.toLowerCase().includes(lowerQuery) ||
    tech.phone?.toLowerCase().includes(lowerQuery)
  );
}
