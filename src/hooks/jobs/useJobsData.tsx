
// This is a minimal fix to address the TypeScript errors in Jobs.tsx
// Only adding the missing properties to the existing hook

import { useState, useEffect } from 'react';
import { initialJobs } from '@/data/jobs';
import { Job } from '@/components/jobs/JobTypes';
import { JOB_CATEGORIES, SERVICE_TYPES } from '@/components/jobs/constants';

export interface UseJobsDataResult {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  // Fix for the TypeScript errors in Jobs.tsx
  selectedServiceTypes: string[];
  toggleServiceType: (serviceType: string) => void;
}

export const useJobsData = (): UseJobsDataResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);

  useEffect(() => {
    try {
      // In a real app, this would be an API call
      setJobs(initialJobs);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes(prev => {
      if (prev.includes(serviceType)) {
        return prev.filter(type => type !== serviceType);
      } else {
        return [...prev, serviceType];
      }
    });
  };

  return {
    jobs,
    loading,
    error,
    selectedServiceTypes,
    toggleServiceType,
  };
};

export default useJobsData;
