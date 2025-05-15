
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import { calculateTechnicianFinancials, ensureCompleteDateRange } from './financialUtils';
import { Technician } from '@/types/technician';

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

// Helper functions for filtering technicians
export const filterTechnicians = (
  technicians: Technician[], 
  paymentTypeFilter: string, 
  selectedTechnicianNames: string[]
): Technician[] => {
  return technicians.filter(tech => {
    // Filter by payment type
    const matchesPaymentType = paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Filter by technician name  
    const matchesName = selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesName;
  });
};

export const toggleTechnicianInFilter = (
  technicianName: string, 
  currentList: string[]
): string[] => {
  if (currentList.includes(technicianName)) {
    return currentList.filter(name => name !== technicianName);
  } else {
    return [...currentList, technicianName];
  }
};

export const calculateFinancialMetrics = (technicians: Technician[]) => {
  const totalRevenue = technicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
  const technicianEarnings = technicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
  
  return {
    totalRevenue,
    technicianEarnings,
    companyProfit: totalRevenue - technicianEarnings
  };
};

export const calculateTechnicianMetrics = (technician: Technician | null) => {
  if (!technician) return null;
  
  return {
    revenue: technician.totalRevenue || 0,
    earnings: technician.earnings || 0,
    completedJobs: technician.completedJobs || 0,
    cancelledJobs: technician.cancelledJobs || 0,
    totalJobs: technician.jobCount || 0
  };
};

// Add date-fns import for format function
import { format } from "date-fns";

// Make sure we export both as a named export and as default
export default useTechnicianFinancials;
