
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";

export interface TechnicianFilters {
  searchTerm?: string;
  status?: string;
  role?: string;
  subRole?: string;
  dateRange?: DateRange;
}

export const filterTechnicians = (
  technicians: Technician[],
  filters: TechnicianFilters
): Technician[] => {
  return technicians.filter((tech) => {
    // Filter by role
    if (filters.role && filters.role !== "all" && tech.role !== filters.role) {
      return false;
    }
    
    // Filter by subRole
    if (filters.subRole && tech.subRole !== filters.subRole) {
      return false;
    }
    
    // Filter by status
    if (filters.status && filters.status !== "all" && tech.status !== filters.status) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        tech.name.toLowerCase().includes(searchLower) ||
        tech.email.toLowerCase().includes(searchLower) ||
        tech.specialty?.toLowerCase().includes(searchLower) ||
        tech.phone?.toLowerCase().includes(searchLower) ||
        tech.position?.toLowerCase().includes(searchLower) ||
        tech.department?.toLowerCase().includes(searchLower) ||
        tech.subRole?.toLowerCase().includes(searchLower);
        
      if (!matchesSearch) return false;
    }
    
    // Filter by date range (hire date)
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const hireDate = new Date(tech.hireDate);
      
      if (filters.dateRange.from && hireDate < filters.dateRange.from) {
        return false;
      }
      
      if (filters.dateRange.to) {
        const toDateEnd = new Date(filters.dateRange.to);
        toDateEnd.setHours(23, 59, 59, 999);
        if (hireDate > toDateEnd) {
          return false;
        }
      }
    }
    
    return true;
  });
};

export const getTechniciansByRole = (
  technicians: Technician[],
  role: string
): Technician[] => {
  if (role === "all") return technicians;
  return technicians.filter((tech) => tech.role === role);
};

export const getUniqueSubRoles = (technicians: Technician[]): string[] => {
  const subRoles = new Set<string>();
  
  technicians.forEach((tech) => {
    if (tech.subRole) {
      subRoles.add(tech.subRole);
    }
  });
  
  return Array.from(subRoles);
};
