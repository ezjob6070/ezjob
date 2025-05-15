
import { useState, useEffect, useMemo } from 'react';
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import { DateRange } from 'react-day-picker';
import { Technician } from '@/types/technician';
import { Job } from '@/components/jobs/JobTypes';
import { calculateFinancialMetrics, formatDateRangeText } from './financialUtils';
import { filterTechnicians, toggleTechnicianInFilter } from './technicianFilters';

export interface TechnicianFinancialsOptions {
  dateRange?: DateRange;
}

const useTechnicianFinancials = (
  filteredTechnicians: Technician[],
  initialDateRange?: DateRange
) => {
  const { jobs } = useGlobalState();
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
    if (!selectedTechnician) return null;
    
    return {
      revenue: selectedTechnician.totalRevenue || 0,
      earnings: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.40 : 0,
      expenses: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.20 : 0,
      profit: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.40 : 0,
      totalJobs: 42,
      completedJobs: 38,
      cancelledJobs: 4,
    };
  }, [selectedTechnician]);
  
  // Format date range for display - using compact format similar to job source page
  const dateRangeText = useMemo(() => {
    return formatDateRangeText(localDateRange);
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
    console.log("Filters applied");
  };
  
  // Handle technician selection for details
  const handleTechnicianSelect = (tech: Technician) => {
    setSelectedTechnician(selectedTechnician?.id === tech.id ? null : tech);
  };
  
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
    handleTechnicianSelect
  };
};

export default useTechnicianFinancials;
