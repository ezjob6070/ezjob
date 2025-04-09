
import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";

// Export the SortOption type
export type SortOption = 
  | 'default'
  | 'name'
  | 'name-asc'
  | 'name-desc'
  | 'date-newest'
  | 'date-oldest'
  | 'revenue-high'
  | 'revenue-low'
  | 'profit-high'
  | 'profit-low'
  | 'jobs-high'
  | 'jobs-low'
  | 'newest'
  | 'oldest';

export const useTechniciansData = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Filter technicians based on search query and filters
  useEffect(() => {
    let result = [...technicians];

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.name.toLowerCase().includes(lowerCaseQuery) ||
          tech.email.toLowerCase().includes(lowerCaseQuery) ||
          tech.phone.includes(searchQuery)
      );
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter((tech) => tech.status === selectedStatus);
    }

    // Apply specialty filter
    if (selectedSpecialty) {
      result = result.filter((tech) => tech.specialty === selectedSpecialty);
    }

    // Apply sorting
    result = sortTechnicians(result, sortOption);

    setFilteredTechnicians(result);
  }, [technicians, searchQuery, selectedStatus, selectedSpecialty, sortOption]);

  // Sort technicians based on selected option
  const sortTechnicians = (techs: Technician[], option: SortOption): Technician[] => {
    const sortedTechs = [...techs];
    
    switch (option) {
      case "name":
      case "name-asc":
        return sortedTechs.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedTechs.sort((a, b) => b.name.localeCompare(a.name));
      case "date-newest":
      case "newest":
        return sortedTechs.sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
      case "date-oldest":
      case "oldest":
        return sortedTechs.sort((a, b) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime());
      case "revenue-high":
        return sortedTechs.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
      case "revenue-low":
        return sortedTechs.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
      case "profit-high":
        return sortedTechs.sort((a, b) => {
          const profitA = (a.totalRevenue || 0) - ((a.totalRevenue || 0) * (a.paymentType === "percentage" ? a.paymentRate / 100 : 0.4));
          const profitB = (b.totalRevenue || 0) - ((b.totalRevenue || 0) * (b.paymentType === "percentage" ? b.paymentRate / 100 : 0.4));
          return profitB - profitA;
        });
      case "profit-low":
        return sortedTechs.sort((a, b) => {
          const profitA = (a.totalRevenue || 0) - ((a.totalRevenue || 0) * (a.paymentType === "percentage" ? a.paymentRate / 100 : 0.4));
          const profitB = (b.totalRevenue || 0) - ((b.totalRevenue || 0) * (b.paymentType === "percentage" ? b.paymentRate / 100 : 0.4));
          return profitA - profitB;
        });
      case "jobs-high":
        return sortedTechs.sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0));
      case "jobs-low":
        return sortedTechs.sort((a, b) => (a.completedJobs || 0) - (b.completedJobs || 0));
      default:
        return sortedTechs;
    }
  };

  // Get all unique specialties from technicians
  const getUniqueSpecialties = (): string[] => {
    const specialties = new Set<string>();
    technicians.forEach((tech) => {
      specialties.add(tech.specialty);
    });
    return Array.from(specialties).sort();
  };

  // Get all unique statuses from technicians
  const getUniqueStatuses = (): string[] => {
    const statuses = new Set<string>();
    technicians.forEach((tech) => {
      statuses.add(tech.status);
    });
    return Array.from(statuses).sort();
  };

  // Get active technicians (status === "active")
  const getActiveTechnicians = (): Technician[] => {
    return technicians.filter((tech) => tech.status === "active");
  };

  return {
    technicians,
    filteredTechnicians,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedSpecialty,
    setSelectedSpecialty,
    sortOption,
    setSortOption,
    getUniqueSpecialties,
    getUniqueStatuses,
    getActiveTechnicians,
  };
};
