
import { useState, useEffect } from 'react';
import { useGlobalState } from '@/components/providers/GlobalStateProvider';
import { DateRange } from 'react-day-picker';
import { Technician } from '@/types/technician';
import { Job } from '@/components/jobs/JobTypes';
import { calculateFinancialMetrics, formatDateRangeText } from './financialUtils';

export interface TechnicianFinancialsOptions {
  dateRange?: DateRange;
}

const useTechnicianFinancials = (options: TechnicianFinancialsOptions = {}) => {
  const { technicians, jobs } = useGlobalState();
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [dateRangeText, setDateRangeText] = useState('');
  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 0,
    technicianEarnings: 0,
    companyProfit: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    cancelledJobs: 0,
    averageJobValue: 0
  });

  useEffect(() => {
    if (!technicians || !jobs) return;

    // Filter technicians based on active status
    const activeTechs = technicians.filter(tech => tech.status === 'active');
    setFilteredTechnicians(activeTechs);
    
    // Filter jobs by date range if provided
    let filteredJobsList = [...jobs];
    
    if (options.dateRange?.from) {
      filteredJobsList = jobs.filter(job => {
        const jobDate = job.date ? new Date(job.date) : null;
        if (!jobDate) return false;
        
        if (options.dateRange?.to) {
          return jobDate >= options.dateRange.from && jobDate <= options.dateRange.to;
        }
        
        return jobDate >= options.dateRange.from;
      });
    }
    
    setFilteredJobs(filteredJobsList);
    setDateRangeText(formatDateRangeText(options.dateRange));
    
    // Calculate financial metrics
    const metrics = calculateFinancialMetrics(activeTechs, filteredJobsList);
    setFinancialMetrics(metrics);
  }, [technicians, jobs, options.dateRange]);

  return {
    technicians: filteredTechnicians,
    jobs: filteredJobs,
    dateRangeText,
    financialMetrics
  };
};

export default useTechnicianFinancials;
