
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export const useTechnicianFinancials = (
  filteredTechnicians: Technician[],
  initialDateRange?: DateRange
) => {
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(initialDateRange);
  
  // Apply filters
  const displayedTechnicians = useMemo(() => {
    return filteredTechnicians.filter(tech => {
      // Filter by payment type
      const matchesPaymentType = 
        paymentTypeFilter === "all" || 
        tech.paymentType === paymentTypeFilter;
      
      // Filter by selected technicians
      const matchesTechnician = 
        selectedTechnicianNames.length === 0 || 
        selectedTechnicianNames.includes(tech.name);
      
      return matchesPaymentType && matchesTechnician;
    });
  }, [filteredTechnicians, paymentTypeFilter, selectedTechnicianNames]);
  
  // Calculate total metrics
  const financialMetrics = useMemo(() => {
    // Calculate total revenue from technicians
    const totalRevenue = displayedTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
    
    // Calculate total technician payments
    const technicianEarnings = displayedTechnicians.reduce((sum, tech) => 
      sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
    );
    
    // Estimate expenses as 33% of revenue
    const totalExpenses = totalRevenue * 0.33;
    
    // Calculate net profit
    const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
    
    return { 
      totalRevenue, 
      technicianEarnings, 
      totalExpenses, 
      companyProfit 
    };
  }, [displayedTechnicians]);
  
  // Get selected technician metrics
  const selectedTechnicianMetrics = useMemo(() => {
    if (!selectedTechnician) return null;
    
    const revenue = selectedTechnician.totalRevenue;
    const earnings = revenue * (selectedTechnician.paymentType === "percentage" 
      ? selectedTechnician.paymentRate / 100 
      : 1);
    const expenses = revenue * 0.33;
    const profit = revenue - earnings - expenses;
    const partsValue = revenue * 0.2; // Assuming parts are 20% of total revenue
    
    return { revenue, earnings, expenses, profit, partsValue };
  }, [selectedTechnician]);
  
  // Format date range for display
  const dateRangeText = useMemo(() => {
    if (!localDateRange?.from) return "";
    
    return localDateRange.to
      ? `${format(localDateRange.from, "MMM d, yyyy")} - ${format(localDateRange.to, "MMM d, yyyy")}`
      : `${format(localDateRange.from, "MMM d, yyyy")}`;
  }, [localDateRange]);
  
  // Handle technician selection
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicianNames(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const clearFilters = () => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter("all");
  };

  const applyFilters = () => {
    // Filters are applied instantly
  };
  
  // Handle technician click
  const handleTechnicianSelect = (tech: Technician) => {
    setSelectedTechnician(selectedTechnician?.id === tech.id ? null : tech);
  };
  
  return {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
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
