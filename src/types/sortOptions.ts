
export type SortOption = 
  | "revenue-high" 
  | "revenue-low" 
  | "name-asc" 
  | "name-desc" 
  | "date-newest" 
  | "date-oldest" 
  | "jobs-high" 
  | "jobs-low" 
  | "price-high" 
  | "price-low";

export const sortOptions = {
  "revenue-high": "Revenue (High to Low)",
  "revenue-low": "Revenue (Low to High)",
  "name-asc": "Name (A to Z)", 
  "name-desc": "Name (Z to A)",
  "date-newest": "Date (Newest First)",
  "date-oldest": "Date (Oldest First)",
  "jobs-high": "Jobs (High to Low)",
  "jobs-low": "Jobs (Low to High)",
  "price-high": "Price (High to Low)",
  "price-low": "Price (Low to High)"
};
