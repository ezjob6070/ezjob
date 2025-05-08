
import { useState, useEffect } from "react";
import { JobSource } from "@/types/jobSource";

export function useJobSources() {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load job sources from localStorage or fetch from API
  useEffect(() => {
    // Mock loading data - in a real app, this would be an API call
    const loadJobSources = () => {
      const storedJobSources = localStorage.getItem('jobSources');
      if (storedJobSources) {
        try {
          const parsedSources = JSON.parse(storedJobSources);
          setJobSources(parsedSources);
        } catch (e) {
          console.error("Error parsing job sources", e);
          setJobSources([]);
        }
      }
      setLoading(false);
    };
    
    loadJobSources();
  }, []);
  
  // Add new job source
  const addJobSource = (jobSource: JobSource) => {
    const newJobSources = [...jobSources, jobSource];
    setJobSources(newJobSources);
    localStorage.setItem('jobSources', JSON.stringify(newJobSources));
  };
  
  // Update existing job source
  const updateJobSource = (updatedSource: JobSource) => {
    const newJobSources = jobSources.map(source => 
      source.id === updatedSource.id ? updatedSource : source
    );
    setJobSources(newJobSources);
    localStorage.setItem('jobSources', JSON.stringify(newJobSources));
  };
  
  // Delete job source
  const deleteJobSource = (sourceId: string) => {
    const newJobSources = jobSources.filter(source => source.id !== sourceId);
    setJobSources(newJobSources);
    localStorage.setItem('jobSources', JSON.stringify(newJobSources));
  };
  
  return {
    jobSources,
    loading,
    addJobSource,
    updateJobSource,
    deleteJobSource
  };
}
