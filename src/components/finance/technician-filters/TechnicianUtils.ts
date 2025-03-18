
import { Technician } from "@/types/technician";

// This function searches across all technician fields
export const searchTechnician = (technician: Technician, query: string): boolean => {
  if (!query.trim()) return true;
  
  const searchLower = query.toLowerCase();
  
  // Match against all possible fields
  return (
    technician.name.toLowerCase().includes(searchLower) ||
    (technician.email && technician.email.toLowerCase().includes(searchLower)) ||
    (technician.phone && technician.phone.toLowerCase().includes(searchLower)) ||
    (technician.specialty && technician.specialty.toLowerCase().includes(searchLower)) ||
    (technician.department && technician.department.toLowerCase().includes(searchLower))
  );
};

// Filter technicians based on payment type
export const filterTechniciansByPaymentType = (
  technicians: Technician[],
  paymentType: string
): Technician[] => {
  if (paymentType === "all") return technicians;
  
  return technicians.filter(technician => 
    technician.paymentType === paymentType
  );
};

// Filter technicians based on date range
export const filterTechniciansByDateRange = (
  technicians: Technician[],
  dateRange: { from?: Date; to?: Date } | undefined
): Technician[] => {
  if (!dateRange?.from || !dateRange?.to) return technicians;
  
  return technicians.filter(technician => {
    if (!technician.hireDate) return true;
    
    const hireDate = new Date(technician.hireDate);
    return hireDate >= dateRange.from! && hireDate <= dateRange.to!;
  });
};
