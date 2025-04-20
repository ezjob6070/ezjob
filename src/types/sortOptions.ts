
// Define a comprehensive SortOption type that covers all current use cases
export type SortOption = 
  // Name sorting
  | "name" | "name-asc" | "name-desc" 
  // Rating sorting
  | "rating" 
  // Jobs sorting
  | "completedJobs" | "jobs-high" | "jobs-low" 
  // Revenue sorting
  | "revenue" | "revenue-high" | "revenue-low" 
  // Profit sorting
  | "profit-high" | "profit-low" 
  // Date-based sorting
  | "newest" | "oldest" 
  // Default option
  | "default";
