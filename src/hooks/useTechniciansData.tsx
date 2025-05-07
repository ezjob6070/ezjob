import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { initialTechnicians } from "@/data/technicians";

export type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "revenue-high" | "revenue-low";

export const useTechniciansData = () => {
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  
  const categories = Array.from(new Set(
    technicians.map(tech => tech.category || "Uncategorized")
  ));
  
  const departments = Array.from(new Set(
    technicians.map(tech => tech.department || "General")
  ));

  const filteredTechnicians = technicians
    .filter(tech => {
      const matchesSearch = searchQuery === "" || 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.phone && tech.phone.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(tech.category || "Uncategorized");
      
      const matchesStatus = statusFilter === "all" || 
        tech.status === statusFilter;
      
      const matchesDepartment = selectedDepartments.length === 0 ||
        selectedDepartments.includes(tech.department || "General");
      
      const matchesDateRange = !dateRange?.from ||
        (tech.hireDate && new Date(tech.hireDate) >= dateRange.from &&
         (!dateRange.to || new Date(tech.hireDate) <= dateRange.to));
        
      const matchesRole = roleFilter === "all" ||
        (tech.role || "technician") === roleFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesDateRange && matchesRole;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.hireDate || 0).getTime() - new Date(a.hireDate || 0).getTime();
        case "oldest":
          return new Date(a.hireDate || 0).getTime() - new Date(b.hireDate || 0).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "revenue-high":
          return (b.totalRevenue || 0) - (a.totalRevenue || 0);
        case "revenue-low":
          return (a.totalRevenue || 0) - (b.totalRevenue || 0);
        default:
          return 0;
      }
    });

  const handleAddTechnician = (newTechnician: Technician) => {
    setTechnicians((prevTechnicians) => [newTechnician, ...prevTechnicians]);
    toast({
      title: "Success",
      description: "New staff added successfully",
    });
  };

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnicians((prevTechnicians) => 
      prevTechnicians.map((tech) => 
        tech.id === updatedTechnician.id ? updatedTechnician : tech
      )
    );
    
    toast({
      title: "Success",
      description: "Staff updated successfully",
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const toggleTechnician = (technicianId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianId)) {
        return prev.filter(id => id !== technicianId);
      } else {
        return [...prev, technicianId];
      }
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(prev => {
      if (prev.includes(department)) {
        return prev.filter(d => d !== department);
      } else {
        return [...prev, department];
      }
    });
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const addCategory = (category: string) => {
    toast({
      title: "Category Added",
      description: `New category "${category}" has been added.`,
    });
  };
  
  const exportTechnicians = () => {
    const dataToExport = filteredTechnicians;
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = 'staff-export.json';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} staff records to JSON.`,
    });
  };

  return {
    technicians,
    filteredTechnicians,
    searchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments,
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments,
    roleFilter,
    handleAddTechnician,
    handleUpdateTechnician,
    handleSearchChange,
    toggleTechnician,
    toggleCategory,
    toggleDepartment,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    setRoleFilter,
    addCategory,
    exportTechnicians,
    setTechnicians
  };
};

export default useTechniciansData;
