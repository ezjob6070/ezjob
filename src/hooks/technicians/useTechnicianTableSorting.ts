
import { useState } from "react";
import { Technician } from "@/types/technician";
import { SortOption } from "@/types/sortOptions";

export const useTechnicianTableSorting = (initialTechnicians: Technician[]) => {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    let sortedTechnicians = [...technicians];
    
    switch (option) {
      case "name-asc":
        sortedTechnicians.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedTechnicians.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "revenue-high":
        sortedTechnicians.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
        break;
      case "revenue-low":
        sortedTechnicians.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
        break;
      case "rating-high":
        sortedTechnicians.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        sortedTechnicians.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "newest":
        sortedTechnicians.sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
        break;
      case "oldest":
        sortedTechnicians.sort((a, b) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime());
        break;
      case "profit-high":
        // Assuming profit calculation
        sortedTechnicians.sort((a, b) => {
          const profitA = (a.totalRevenue || 0) * (1 - (a.paymentRate / 100));
          const profitB = (b.totalRevenue || 0) * (1 - (b.paymentRate / 100));
          return profitB - profitA;
        });
        break;
      case "profit-low":
        // Assuming profit calculation
        sortedTechnicians.sort((a, b) => {
          const profitA = (a.totalRevenue || 0) * (1 - (a.paymentRate / 100));
          const profitB = (b.totalRevenue || 0) * (1 - (b.paymentRate / 100));
          return profitA - profitB;
        });
        break;
      case "jobs-high":
        sortedTechnicians.sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0));
        break;
      case "jobs-low":
        sortedTechnicians.sort((a, b) => (a.completedJobs || 0) - (b.completedJobs || 0));
        break;
      default:
        // Default sort by name
        sortedTechnicians.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setTechnicians(sortedTechnicians);
  };

  return { technicians, sortOption, setSortOption, handleSortChange };
};

export default useTechnicianTableSorting;
