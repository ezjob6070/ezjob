
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { SortOption } from "@/types/sortOptions";

export interface TechnicianFilterOptions {
  selectedTechnicianNames: string[];
  paymentTypeFilter: string;
  localDateRange?: DateRange;
  showDateFilter?: boolean;
}

export function useTechnicianFilters(technicians: Technician[]) {
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(undefined);
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);

  // Extract technician names
  const technicianNames = technicians.map(tech => tech.name);

  // Filter technicians based on criteria
  const filteredTechnicians = technicians.filter(tech => {
    // Filter by selected technician names
    const matchesTechnicianFilter = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    // Filter by payment type
    const matchesPaymentType = paymentTypeFilter === "all" ||
      tech.paymentType === paymentTypeFilter;
    
    // Filter by date range
    const matchesDateRange = !localDateRange?.from || !localDateRange?.to || 
      (tech.hireDate && new Date(tech.hireDate) >= localDateRange.from && 
       new Date(tech.hireDate) <= localDateRange.to);
    
    return matchesTechnicianFilter && matchesPaymentType && matchesDateRange;
  });

  // Sort technicians based on the selected sort option
  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    switch (sortOption) {
      case "revenue-high":
        return (b.totalRevenue || 0) - (a.totalRevenue || 0);
      case "revenue-low":
        return (a.totalRevenue || 0) - (b.totalRevenue || 0);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.hireDate || 0).getTime() - new Date(a.hireDate || 0).getTime();
      case "oldest":
        return new Date(a.hireDate || 0).getTime() - new Date(b.hireDate || 0).getTime();
      default:
        return 0;
    }
  });

  // Toggle a technician in the selected list
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicianNames(prev => {
      if (prev.includes(techName)) {
        return prev.filter(name => name !== techName);
      } else {
        return [...prev, techName];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter("all");
    setLocalDateRange(undefined);
  };
  
  // Apply filters
  const applyFilters = () => {
    setAppliedFilters(true);
  };
  
  return {
    selectedTechnicianNames,
    setSelectedTechnicianNames,
    paymentTypeFilter,
    setPaymentTypeFilter,
    localDateRange,
    setLocalDateRange,
    showDateFilter,
    setShowDateFilter,
    sortOption,
    setSortOption,
    appliedFilters,
    setAppliedFilters,
    technicianNames,
    filteredTechnicians: sortedTechnicians,
    toggleTechnician,
    clearFilters,
    applyFilters
  };
}
