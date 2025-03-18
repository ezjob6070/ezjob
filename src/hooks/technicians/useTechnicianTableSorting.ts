
import { useState } from "react";
import { Technician } from "@/types/technician";

export type SortOption = "default" | "name-asc" | "name-desc" | "profit-high" | "profit-low";

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
        const profitA = a.totalRevenue - (a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1)) - (a.totalRevenue * 0.33);
        const profitB = b.totalRevenue - (b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1)) - (b.totalRevenue * 0.33);
        return profitB - profitA;
      case "profit-low":
        const profitC = a.totalRevenue - (a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1)) - (a.totalRevenue * 0.33);
        const profitD = b.totalRevenue - (b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1)) - (b.totalRevenue * 0.33);
        return profitC - profitD;
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
