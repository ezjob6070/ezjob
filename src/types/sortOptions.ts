
// Define a union type for allowed sort options 
export type SortOption = 
  | "name-asc" 
  | "name-desc" 
  | "date-asc" 
  | "date-desc" 
  | "revenue-high" 
  | "revenue-low" 
  | "jobs-high" 
  | "jobs-low" 
  | string;

// For job sources dashboard
export const JOB_SOURCE_SORT_OPTIONS = {
  JOBS_HIGH: "jobs-high",
  JOBS_LOW: "jobs-low",
  REVENUE_HIGH: "revenue-high",
  REVENUE_LOW: "revenue-low",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc"
};
