
import { useState, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import { calculateTechnicianFinancials, ensureCompleteDateRange } from './financialUtils';
import { Technician } from '@/types/technician';

const useTechnicianFinancials = (dateRange?: DateRange) => {
  const { technicians, jobs } = useGlobalState();
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate financials when data changes
  useEffect(() => {
    setIsLoading(true);
    try {
      const techniciansWithFinancials = calculateTechnicianFinancials(
        technicians,
        jobs,
        dateRange
      );
      setFilteredTechnicians(techniciansWithFinancials);
    } catch (error) {
      console.error('Error calculating technician financials:', error);
      setFilteredTechnicians([]);
    } finally {
      setIsLoading(false);
    }
  }, [technicians, jobs, dateRange]);

  // Calculate totals and summary data
  const financialSummary = useMemo(() => {
    const totalRevenue = filteredTechnicians.reduce((sum, tech) => sum + (tech.totalRevenue || 0), 0);
    const totalEarnings = filteredTechnicians.reduce((sum, tech) => sum + (tech.earnings || 0), 0);
    const totalJobs = filteredTechnicians.reduce((sum, tech) => sum + (tech.jobCount || 0), 0);
    const totalCompletedJobs = filteredTechnicians.reduce((sum, tech) => sum + (tech.completedJobs || 0), 0);
    
    return {
      totalRevenue,
      totalEarnings,
      totalJobs,
      totalCompletedJobs,
      companyProfit: totalRevenue - totalEarnings,
      averageJobValue: totalJobs > 0 ? totalRevenue / totalJobs : 0
    };
  }, [filteredTechnicians]);

  // Group technicians by role
  const techniciansByRole = useMemo(() => {
    const grouped: Record<string, Technician[]> = {};
    
    filteredTechnicians.forEach(tech => {
      const role = tech.role || 'other';
      if (!grouped[role]) grouped[role] = [];
      grouped[role].push(tech);
    });
    
    return grouped;
  }, [filteredTechnicians]);

  return {
    technicians: filteredTechnicians,
    techniciansByRole,
    financialSummary,
    isLoading,
    dateRange: ensureCompleteDateRange(dateRange)
  };
};

export default useTechnicianFinancials;
