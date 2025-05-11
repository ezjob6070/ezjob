
// Define SortOption type for use in various components
export type SortOption = 
  | "newest" 
  | "oldest" 
  | "name-asc" 
  | "name-desc" 
  | "revenue-high" 
  | "revenue-low"
  | string; // Add string to handle cases where a string is passed
