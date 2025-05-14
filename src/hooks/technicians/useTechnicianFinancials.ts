
import { useState, useMemo, useCallback } from 'react';
import { Technician } from '@/types/technician';
import { DateRange } from 'react-day-picker';
import { calculateFinancialMetrics, calculateTechnicianMetrics, FinancialMetrics } from './financialUtils';
import { formatDateRange } from '@/lib/date-utils';

export function useTechnicianFinancials(technicians: Technician[], dateRange?: DateRange) {
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(dateRange);
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<boolean>(false);

  // Filter technicians based on selected criteria
  const displayedTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      // Filter by selected technicians
      const matchesTechnician = selectedTechnicianNames.length === 0 || 
        selectedTechnicianNames.includes(tech.name);
      
      // Filter by payment type
      const matchesPaymentType = paymentTypeFilter === "all" || 
        tech.paymentType === paymentTypeFilter;
      
      // Filter by date range
      const matchesDateRange = !localDateRange?.from || !localDateRange?.to || 
        (tech.hireDate && new Date(tech.hireDate) >= localDateRange.from && 
         new Date(tech.hireDate) <= localDateRange.to);
      
      return matchesTechnician && matchesPaymentType && matchesDateRange;
    });
  }, [technicians, selectedTechnicianNames, paymentTypeFilter, localDateRange]);

  // Calculate financial metrics for all displayed technicians
  const financialMetrics = useMemo(() => {
    return calculateFinancialMetrics(displayedTechnicians);
  }, [displayedTechnicians]);

  // Calculate metrics for selected technician
  const selectedTechnicianMetrics = useMemo(() => {
    if (!selectedTechnician) return null;
    return calculateTechnicianMetrics(selectedTechnician);
  }, [selectedTechnician]);

  // Format date range for display
  const dateRangeText = useMemo(() => {
    if (localDateRange?.from && localDateRange?.to) {
      return formatDateRange(localDateRange.from, localDateRange.to);
    }
    return "All Time";
  }, [localDateRange]);

  // Toggle a technician in the selected list
  const toggleTechnician = useCallback((techName: string) => {
    setSelectedTechnicianNames(prev => {
      if (prev.includes(techName)) {
        return prev.filter(name => name !== techName);
      } else {
        return [...prev, techName];
      }
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter("all");
    setLocalDateRange(undefined);
    setAppliedFilters(false);
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    setAppliedFilters(true);
  }, []);

  // Handle technician selection
  const handleTechnicianSelect = useCallback((tech: Technician) => {
    setSelectedTechnician(tech);
  }, []);

  return {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,
    selectedTechnician,
    localDateRange,
    setLocalDateRange,
    showDateFilter,
    setShowDateFilter,
    displayedTechnicians,
    financialMetrics,
    selectedTechnicianMetrics,
    dateRangeText,
    appliedFilters,
    setAppliedFilters,
    toggleTechnician,
    clearFilters,
    applyFilters,
    handleTechnicianSelect
  };
}

export default useTechnicianFinancials;
