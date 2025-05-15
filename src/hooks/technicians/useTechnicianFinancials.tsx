
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { 
  calculateFinancialMetrics, 
  calculateTechnicianMetrics, 
  formatDateRangeText 
} from "./financialUtils";
import { filterTechnicians, toggleTechnicianInFilter } from "./technicianFilters";
import { format } from "date-fns";

export interface TechnicianFinancialsHookReturn {
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  selectedTechnicianNames: string[];
  setSelectedTechnicianNames: (names: string[]) => void;
  selectedTechnician: Technician | null;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  displayedTechnicians: Technician[];
  financialMetrics: any;
  selectedTechnicianMetrics: any;
  dateRangeText: string;
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  handleTechnicianSelect: (technician: Technician) => void;
  technicians: Technician[];
  techniciansByRole: Record<string, Technician[]>;
  financialSummary: {
    totalRevenue: number;
    totalEarnings: number;
    totalJobs: number;
    totalCompletedJobs: number;
    companyProfit: number;
    averageJobValue: number;
  };
  isLoading: boolean;
  dateRange: DateRange | undefined;
}

export const useTechnicianFinancials = (
  filteredTechnicians: Technician[],
  initialDateRange?: DateRange
): TechnicianFinancialsHookReturn => {
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
  
  // Additional properties needed by components
  const techniciansByRole = useMemo(() => {
    const grouped: Record<string, Technician[]> = {};
    
    filteredTechnicians.forEach(tech => {
      const role = tech.role || 'other';
      if (!grouped[role]) grouped[role] = [];
      grouped[role].push(tech);
    });
    
    return grouped;
  }, [filteredTechnicians]);

  const financialSummary = useMemo(() => {
    const totalRevenue = displayedTechnicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
    const totalEarnings = displayedTechnicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
    const totalJobs = displayedTechnicians.reduce((sum, tech) => sum + (tech.jobCount || 0), 0);
    const totalCompletedJobs = displayedTechnicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
    
    return {
      totalRevenue,
      totalEarnings,
      totalJobs,
      totalCompletedJobs,
      companyProfit: totalRevenue - totalEarnings,
      averageJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0
    };
  }, [displayedTechnicians]);
  
  return {
    // Original hook properties
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,
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
    handleTechnicianSelect,
    
    // Additional properties needed by other components
    technicians: filteredTechnicians,
    techniciansByRole,
    financialSummary,
    isLoading: false,
    dateRange: localDateRange
  };
};

// Make sure we export both as a named export and as default
export default useTechnicianFinancials;
