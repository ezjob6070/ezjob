
// Define a global SortOption type for consistent sorting across the app
export type SortOption = 
  | "newest"       // Sort by newest creation date
  | "oldest"       // Sort by oldest creation date
  | "name-asc"     // Sort by name (A-Z)
  | "name-desc"    // Sort by name (Z-A)
  | "amount-high"  // Sort by amount (highest first)
  | "amount-low"   // Sort by amount (lowest first)
  | "revenue-high" // Sort by revenue (highest first)
  | "revenue-low"  // Sort by revenue (lowest first)
  | "profit-high"  // Sort by profit (highest first)
  | "profit-low"   // Sort by profit (lowest first)
  | "jobs-high"    // Sort by number of jobs (highest first)
  | "jobs-low";    // Sort by number of jobs (lowest first)
