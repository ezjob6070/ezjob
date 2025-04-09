
import { useState } from "react";
import { Technician } from "@/types/technician";

export type SortOption = 
  | "default" 
  | "name-asc" 
  | "name-desc" 
  | "profit-high" 
  | "profit-low" 
  | "revenue-high" 
  | "revenue-low" 
  | "newest" 
  | "oldest";

export const useTechnicianTableSorting = (technicians: Technician[]) => {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  
  // Sort technicians based on selected sort option
  const sortedTechnicians = [...technicians].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "profit-high":
        const profitA = (a.totalRevenue || 0) - ((a.totalRevenue || 0) * (a.paymentType === "percentage" ? a.paymentRate / 100 : 0.4));
        const profitB = (b.totalRevenue || 0) - ((b.totalRevenue || 0) * (b.paymentType === "percentage" ? b.paymentRate / 100 : 0.4));
        return profitB - profitA;
      case "profit-low":
        const profitC = (a.totalRevenue || 0) - ((a.totalRevenue || 0) * (a.paymentType === "percentage" ? a.paymentRate / 100 : 0.4));
        const profitD = (b.totalRevenue || 0) - ((b.totalRevenue || 0) * (b.paymentType === "percentage" ? b.paymentRate / 100 : 0.4));
        return profitC - profitD;
      case "revenue-high":
        return (b.totalRevenue || 0) - (a.totalRevenue || 0);
      case "revenue-low":
        return (a.totalRevenue || 0) - (b.totalRevenue || 0);
      case "newest":
        return new Date(b.hireDate || 0).getTime() - new Date(a.hireDate || 0).getTime();
      case "oldest":
        return new Date(a.hireDate || 0).getTime() - new Date(b.hireDate || 0).getTime();
      default:
        return 0;
    }
  });

  return {
    sortBy,
    setSortBy,
    sortedTechnicians
  };
};

export default useTechnicianTableSorting;
