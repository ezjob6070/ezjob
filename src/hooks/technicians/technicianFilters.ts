
import { useState } from 'react';
import { Technician } from '@/types/technician';
import { DateRange } from 'react-day-picker';

// Filter technicians based on various criteria
export const filterTechnicians = (
  technicians: Technician[],
  selectedTechNames: string[] = [],
  paymentTypeFilter: string = 'all',
) => {
  // Start with all technicians if no names are selected
  let filtered = selectedTechNames.length > 0
    ? technicians.filter(tech => selectedTechNames.includes(tech.name))
    : [...technicians];
  
  // Apply payment type filter if specified
  if (paymentTypeFilter !== 'all') {
    filtered = filtered.filter(tech => tech.paymentType === paymentTypeFilter);
  }
  
  return filtered;
};

// Toggle technician in selection array
export const toggleTechnicianInFilter = (
  techName: string,
  selectedTechs: string[],
) => {
  return selectedTechs.includes(techName)
    ? selectedTechs.filter(name => name !== techName)
    : [...selectedTechs, techName];
};

// Hook for technician filtering
export const useTechnicianFilters = (initialTechnicians: Technician[]) => {
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(initialTechnicians);
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(undefined);

  const toggleTechnician = (techName: string) => {
    const newSelected = toggleTechnicianInFilter(techName, selectedTechnicianNames);
    setSelectedTechnicianNames(newSelected);
  };

  const clearFilters = () => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter('all');
    setLocalDateRange(undefined);
    setFilteredTechnicians(initialTechnicians);
  };

  const applyFilters = () => {
    const filtered = filterTechnicians(
      initialTechnicians,
      selectedTechnicianNames,
      paymentTypeFilter
    );
    setFilteredTechnicians(filtered);
  };

  return {
    filteredTechnicians,
    selectedTechnicianNames,
    setSelectedTechnicianNames,
    paymentTypeFilter,
    setPaymentTypeFilter,
    localDateRange,
    setLocalDateRange,
    toggleTechnician,
    clearFilters,
    applyFilters,
  };
};
