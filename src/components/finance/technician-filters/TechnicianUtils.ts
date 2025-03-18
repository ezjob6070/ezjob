
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

// Filter technicians based on selected categories
export const filterTechniciansByCategory = (
  technicians: Technician[], 
  selectedCategories: string[]
): Technician[] => {
  if (selectedCategories.length === 0) return technicians;
  
  return technicians.filter(technician => 
    (technician.category && selectedCategories.includes(technician.category)) ||
    (!technician.category && selectedCategories.includes("Uncategorized"))
  );
};

// Filter technicians based on date range
export const filterTechniciansByDate = (
  technicians: Technician[],
  dateRange: { from?: Date; to?: Date } | undefined,
  appliedFilters: boolean
): Technician[] => {
  if (!appliedFilters || !dateRange?.from) return technicians;
  
  return technicians.filter(technician => {
    if (!technician.hireDate) return true;
    
    const technicianDate = new Date(technician.hireDate);
    let matchesDateRange = true;
    
    if (dateRange.from) {
      matchesDateRange = technicianDate >= dateRange.from;
    }
    
    if (dateRange.to && matchesDateRange) {
      matchesDateRange = technicianDate <= dateRange.to;
    }
    
    return matchesDateRange;
  });
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
