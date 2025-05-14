
// Defines utilities for filtering technicians
import { Technician } from "@/types/technician";

/**
 * Filter technicians based on role
 */
export const filterTechniciansByRole = (
  technicians: Technician[],
  role: string
): Technician[] => {
  if (role === "all") {
    return technicians;
  }
  return technicians.filter((tech) => tech.role === role);
};

/**
 * Filter technicians based on subRole
 */
export const filterTechniciansBySubRole = (
  technicians: Technician[],
  subRole: string | null
): Technician[] => {
  if (!subRole) {
    return technicians;
  }
  return technicians.filter((tech) => tech.subRole === subRole);
};

/**
 * Filter technicians based on status
 */
export const filterTechniciansByStatus = (
  technicians: Technician[],
  status: string
): Technician[] => {
  if (status === "all") {
    return technicians;
  }
  return technicians.filter((tech) => tech.status === status);
};
