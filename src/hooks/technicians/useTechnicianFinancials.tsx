
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import { calculateTechnicianFinancials, ensureCompleteDateRange } from './financialUtils';
import { Technician } from '@/types/technician';
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

const useTechnicianFinancials = (initialDateRange?: DateRange): TechnicianFinancialsHookReturn => {
  const { technicians, jobs } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(initialDateRange);
  
  // Process technicians with financial data
  const processedTechnicians = useMemo(() => {
    setIsLoading(true);
    try {
      return calculateTechnicianFinancials(technicians, jobs, localDateRange);
    } catch (error) {
      console.error('Error calculating technician financials:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [technicians, jobs, localDateRange]);

  // Apply filters to get displayed technicians
  const displayedTechnicians = useMemo(() => {
    return processedTechnicians.filter(tech => {
      // Filter by payment type
      const matchesPaymentType = paymentTypeFilter === "all" || 
        tech.paymentType === paymentTypeFilter;
      
      // Filter by technician name  
      const matchesName = selectedTechnicianNames.length === 0 || 
        selectedTechnicianNames.includes(tech.name);
      
      return matchesPaymentType && matchesName;
    });
  }, [processedTechnicians, paymentTypeFilter, selectedTechnicianNames]);
  
  // Calculate total metrics for all displayed technicians
  const financialMetrics = useMemo(() => {
    const totalRevenue = displayedTechnicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
    const technicianEarnings = displayedTechnicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
    
    return {
      totalRevenue,
      technicianEarnings,
      companyProfit: totalRevenue - technicianEarnings
    };
  }, [displayedTechnicians]);
  
  // Get selected technician metrics
  const selectedTechnicianMetrics = useMemo(() => {
    if (!selectedTechnician) return null;
    
    return {
      revenue: selectedTechnician.totalRevenue || 0,
      earnings: selectedTechnician.earnings || 0,
      completedJobs: selectedTechnician.completedJobs || 0,
      cancelledJobs: selectedTechnician.cancelledJobs || 0,
      totalJobs: selectedTechnician.jobCount || 0
    };
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
  };

  // Apply filters (currently applied instantly)
  const applyFilters = () => {
    // Filters are applied instantly
  };
  
  // Handle technician selection for details
  const handleTechnicianSelect = (tech: Technician) => {
    setSelectedTechnician(selectedTechnician?.id === tech.id ? null : tech);
  };
  
  // Group technicians by role
  const techniciansByRole = useMemo(() => {
    const grouped: Record<string, Technician[]> = {};
    
    processedTechnicians.forEach(tech => {
      const role = tech.role || 'other';
      if (!grouped[role]) grouped[role] = [];
      grouped[role].push(tech);
    });
    
    return grouped;
  }, [processedTechnicians]);

  // Calculate overall financial summary
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
    technicians: processedTechnicians,
    techniciansByRole,
    financialSummary,
    isLoading,
    dateRange: localDateRange
  };
};

export default useTechnicianFinancials;
