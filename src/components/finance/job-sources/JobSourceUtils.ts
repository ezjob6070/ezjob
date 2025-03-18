
import { JobSource } from "@/types/finance";

// This function searches across all job source fields
export const searchJobSource = (source: JobSource, query: string): boolean => {
  if (!query.trim()) return true;
  
  const searchLower = query.toLowerCase();
  
  // Match against all possible fields
  return (
    source.name.toLowerCase().includes(searchLower) ||
    (source.phoneNumber?.toLowerCase().includes(searchLower) || false) ||
    (source.emailAddress?.toLowerCase().includes(searchLower) || false) ||
    (source.website?.toLowerCase().includes(searchLower) || false) ||
    (source.category?.toLowerCase().includes(searchLower) || false)
  );
};

// Filter job sources based on selected categories
export const filterSourcesByCategory = (
  sources: JobSource[], 
  selectedCategories: string[]
): JobSource[] => {
  if (selectedCategories.length === 0) return sources;
  
  return sources.filter(source => 
    (source.category && selectedCategories.includes(source.category)) ||
    (!source.category && selectedCategories.includes("Others"))
  );
};

// Filter job sources based on date range
export const filterSourcesByDate = (
  sources: JobSource[],
  dateRange: { from?: Date; to?: Date } | undefined,
  appliedFilters: boolean
): JobSource[] => {
  if (!appliedFilters || !dateRange?.from) return sources;
  
  return sources.filter(source => {
    if (!source.createdAt) return true;
    
    const sourceDate = new Date(source.createdAt);
    let matchesDateRange = true;
    
    if (dateRange.from) {
      matchesDateRange = sourceDate >= dateRange.from;
    }
    
    if (dateRange.to && matchesDateRange) {
      matchesDateRange = sourceDate <= dateRange.to;
    }
    
    return matchesDateRange;
  });
};
