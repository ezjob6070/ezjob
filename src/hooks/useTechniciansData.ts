
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import { DateRange } from "react-day-picker";

// Make sure this SortOption type is the same one used in TechnicianSortFilter.tsx
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
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians || []);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(initialTechnicians || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  
  // Safely create categories using a fallback for undefined values
  const categories = Array.from(new Set(
    (technicians || []).map(tech => tech.category || "Uncategorized")
  ));
  
  // Safely create departments using a fallback for undefined values
  const departments = Array.from(new Set(
    (technicians || []).map(tech => tech.department || "General")
  ));

  // Filter technicians based on search query and filters
  useEffect(() => {
    let result = [...(technicians || [])];

    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (tech) =>
          tech.name.toLowerCase().includes(lowerCaseQuery) ||
          tech.email.toLowerCase().includes(lowerCaseQuery) ||
          (tech.phone && tech.phone.includes(searchQuery)) ||
          tech.specialty.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      result = result.filter((tech) => tech.status === statusFilter);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(tech => 
        selectedCategories.includes(tech.category || "Uncategorized")
      );
    }

    // Apply department filter
    if (selectedDepartments.length > 0) {
      result = result.filter(tech =>
        selectedDepartments.includes(tech.department || "General")
      );
    }

    // Apply date range filter
    if (dateRange?.from) {
      const from = new Date(dateRange.from);
      const to = dateRange.to ? new Date(dateRange.to) : new Date();
      
      result = result.filter(tech => {
        const hireDate = new Date(tech.hireDate);
        return hireDate >= from && hireDate <= to;
      });
    }

    // Apply sorting
    result = sortTechnicians(result, sortOption);

    setFilteredTechnicians(result);
  }, [technicians, searchQuery, selectedTechnicians, selectedCategories, 
      selectedDepartments, statusFilter, sortOption, dateRange]);

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

  // Handle adding a new technician
  const handleAddTechnician = (newTechnician: Technician) => {
    setTechnicians((prevTechnicians) => [newTechnician, ...prevTechnicians]);
    toast({
      title: "Success",
      description: "New technician added successfully",
    });
  };

  // Handle updating an existing technician
  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnicians((prevTechnicians) => 
      prevTechnicians.map((tech) => 
        tech.id === updatedTechnician.id ? updatedTechnician : tech
      )
    );
    
    toast({
      title: "Success",
      description: "Technician updated successfully",
    });
  };

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Toggle technician selection
  const toggleTechnician = (technicianId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianId)) {
        return prev.filter(id => id !== technicianId);
      } else {
        return [...prev, technicianId];
      }
    });
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Toggle department selection
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => {
      if (prev.includes(department)) {
        return prev.filter(d => d !== department);
      } else {
        return [...prev, department];
      }
    });
  };

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Add category
  const addCategory = (category: string) => {
    toast({
      title: "Category Added",
      description: `New category "${category}" has been added.`,
    });
  };
  
  // Export technicians
  const exportTechnicians = () => {
    const dataToExport = filteredTechnicians;
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = 'technicians-export.json';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} technicians to JSON.`,
    });
  };

  return {
    technicians,
    filteredTechnicians,
    searchQuery,
    setSearchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments,
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments,
    handleAddTechnician,
    handleUpdateTechnician,
    handleSearchChange,
    toggleTechnician,
    toggleCategory,
    toggleDepartment,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    addCategory,
    exportTechnicians,
    getUniqueSpecialties,
    getUniqueStatuses,
    getActiveTechnicians
  };
};

export default useTechniciansData;
