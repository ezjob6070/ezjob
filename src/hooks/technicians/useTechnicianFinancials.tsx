
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { calculateFinancialMetrics, calculateTechnicianMetrics, formatDateRangeText } from "./financialUtils";
import { filterTechnicians, toggleTechnicianInFilter } from "./technicianFilters";
import { format } from "date-fns";

export const useTechnicianFinancials = (
  filteredTechnicians: Technician[],
  initialDateRange?: DateRange
) => {
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(initialDateRange);
  
  // Apply filters to get displayed technicians
  const displayedTechnicians = useMemo(() => {
    return filterTechnicians(filteredTechnicians, paymentTypeFilter, selectedTechnicianNames);
  }, [filteredTechnicians, paymentTypeFilter, selectedTechnicianNames]);
  
  // Calculate total metrics for all displayed technicians
  const financialMetrics = useMemo(() => {
    return calculateFinancialMetrics(displayedTechnicians);
  }, [displayedTechnicians]);
  
  // Get selected technician metrics
  const selectedTechnicianMetrics = useMemo(() => {
    return calculateTechnicianMetrics(selectedTechnician);
  }, [selectedTechnician]);
  
  // Format date range for display - using compact format similar to job source page
  const dateRangeText = useMemo(() => {
    if (!localDateRange?.from) return "";
    
    if (localDateRange.to) {
      if (localDateRange.from.toDateString() === localDateRange.to.toDateString()) {
        // Same day
        return format(localDateRange.from, "MMM d, yyyy");
      }
      return `${format(localDateRange.from, "MMM d")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(localDateRange.from, "MMM d, yyyy");
  }, [localDateRange]);
  
  // Handle technician selection in filters
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicianNames(prev => toggleTechnicianInFilter(techName, prev));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter("all");
  };

  // Apply filters (currently applied instantly)
  const applyFilters = () => {
    // Filters are applied instantly
  };
  
  // Handle technician selection for details
  const handleTechnicianSelect = (tech: Technician) => {
    setSelectedTechnician(selectedTechnician?.id === tech.id ? null : tech);
  };
  
  return {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,  // Explicitly return this function
    selectedTechnician,
    localDateRange,
    setLocalDateRange,
    displayedTechnicians,
    financialMetrics,
    selectedTechnicianMetrics,
    dateRangeText,
    toggleTechnician,
    clearFilters,
    applyFilters,
    handleTechnicianSelect
  };
};

export default useTechnicianFinancials;
