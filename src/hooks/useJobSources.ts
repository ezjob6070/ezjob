
import { useState } from "react";

export const useJobSources = (jobSourceNames: string[]) => {
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(t => t !== sourceName)
        : [...prev, sourceName]
    );
  };

  const selectAllJobSources = () => {
    setSelectedJobSources(jobSourceNames);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const allSelected = jobSourceNames.length > 0 && selectedJobSources.length === jobSourceNames.length;
  const someSelected = selectedJobSources.length > 0 && selectedJobSources.length < jobSourceNames.length;

  const filteredJobSources = jobSourceNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    selectedJobSources,
    searchQuery,
    setSearchQuery,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources,
    allSelected,
    someSelected,
    filteredJobSources,
  };
};
