import { useState, useEffect } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";

// Export the SortOption type
export type SortOption = 
  | 'default'
  | 'name'
  | 'date-newest'
  | 'date-oldest'
  | 'revenue-high'
  | 'revenue-low';

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
      result = result.filter((tech) =>
        tech.specialties.includes(selectedSpecialty)
      );
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
        return sortedTechs.sort((a, b) => a.name.localeCompare(b.name));
      case "date-newest":
        return sortedTechs.sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime());
      case "date-oldest":
        return sortedTechs.sort((a, b) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime());
      case "revenue-high":
        return sortedTechs.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
      case "revenue-low":
        return sortedTechs.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
      default:
        return sortedTechs;
    }
  };

  // Get all unique specialties from technicians
  const getUniqueSpecialties = (): string[] => {
    const specialties = new Set<string>();
    technicians.forEach((tech) => {
      tech.specialties.forEach((specialty) => {
        specialties.add(specialty);
      });
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

  // Get active technicians (status === "Active")
  const getActiveTechnicians = (): Technician[] => {
    return technicians.filter((tech) => tech.status === "Active");
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
