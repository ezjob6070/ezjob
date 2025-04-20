
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/types/sortOptions";
import { useToast } from "@/components/ui/use-toast";
import { initialTechnicians } from "@/data/technicians";

export function useTechniciansData() {
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [categories, setCategories] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  // Update handleSearchChange to accept a string directly
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const addCategory = (category: string) => {
    toast({
      title: "Category Added",
      description: `New category "${category}" has been added.`,
    });
  };

  const toggleTechnician = (technicianId: string) => {
    setSelectedTechnicians((prevSelected) =>
      prevSelected.includes(technicianId)
        ? prevSelected.filter((id) => id !== technicianId)
        : [...prevSelected, technicianId]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const toggleDepartment = (department: string) => {
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(department)
        ? prevSelected.filter((d) => d !== department)
        : [...prevSelected, department]
    );
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const exportTechnicians = () => {
    const csvRows = [];
    const headers = Object.keys(technicians[0]);
    csvRows.push(headers.join(','));

    for (const technician of technicians) {
      const values = headers.map(header => technician[header]);
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'technicians.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return {
    technicians,
    filteredTechnicians: useMemo(() => {
      let filtered = [...technicians];

      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        filtered = filtered.filter((technician) =>
          technician.name.toLowerCase().includes(searchTerm) ||
          technician.email?.toLowerCase().includes(searchTerm) ||
          technician.phone.toLowerCase().includes(searchTerm) ||
          technician.specialty.toLowerCase().includes(searchTerm)
        );
      }

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((technician) =>
          selectedCategories.includes(technician.specialty)
        );
      }

      if (selectedDepartments.length > 0) {
        filtered = filtered.filter((technician) =>
          selectedDepartments.includes(technician.department || "")
        );
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((technician) => technician.status === statusFilter);
      }

      if (dateRange?.from && dateRange?.to) {
        filtered = filtered.filter((technician) => {
          const hireDate = new Date(technician.hireDate);
          return hireDate >= dateRange.from! && hireDate <= dateRange.to!;
        });
      }

      switch (sortOption) {
        case "name":
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "completedJobs":
        case "jobs-high":
          filtered.sort((a, b) => b.completedJobs - a.completedJobs);
          break;
        case "jobs-low":
          filtered.sort((a, b) => a.completedJobs - b.completedJobs);
          break;
        case "revenue":
        case "revenue-high":
          filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
          break;
        case "revenue-low":
          filtered.sort((a, b) => a.totalRevenue - b.totalRevenue);
          break;
        case "profit-high":
          filtered.sort((a, b) => (b.totalRevenue * 0.4) - (a.totalRevenue * 0.4));
          break;
        case "profit-low":
          filtered.sort((a, b) => (a.totalRevenue * 0.4) - (b.totalRevenue * 0.4));
          break;
        case "newest":
          filtered.sort((a, b) => new Date(b.hireDate || 0).getTime() - new Date(a.hireDate || 0).getTime());
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.hireDate || 0).getTime() - new Date(b.hireDate || 0).getTime());
          break;
        default:
          break;
      }

      return filtered;
    }, [technicians, searchQuery, selectedCategories, selectedDepartments, statusFilter, sortOption, dateRange]),
    searchQuery,
    selectedTechnicians,
    selectedCategories,
    selectedDepartments,
    statusFilter,
    sortOption,
    dateRange,
    categories,
    departments,
    handleSearchChange,
    toggleTechnician,
    toggleCategory,
    toggleDepartment,
    handleSortChange,
    setStatusFilter,
    setDateRange,
    addCategory,
    setTechnicians,
    setDepartments,
    exportTechnicians
  };
}

export default useTechniciansData;
