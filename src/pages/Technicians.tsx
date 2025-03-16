import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusIcon, ListChecks, Filter, Download, MoreHorizontal } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { Link } from "react-router-dom";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import { initialTechnicians } from "@/data/technicians";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define extended sort options
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "revenue-high" | "revenue-low";

const Technicians = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const categories = Array.from(new Set(
    technicians.map(tech => tech.category || "Uncategorized")
  ));
  
  const departments = Array.from(new Set(
    technicians.map(tech => tech.department || "General")
  ));
  
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

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
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesDateRange;
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
      description: "New technician added successfully",
    });
  };

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setShowEditModal(true);
  };

  const handleUpdateTechnician = (values: any) => {
    const updatedTechnician: Technician = {
      ...selectedTechnician!,
      ...values
    };
    
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

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Technicians
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your technicians and their payment structures
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/technician-altercation">
            <Button variant="outline" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Technician Altercation
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Technician Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportTechnicians}>
                <Download className="h-4 w-4 mr-2" />
                Export Technicians
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="h-4 w-4 mr-2" />
                Bulk Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Technician
          </Button>
        </div>
      </div>

      <TechnicianStats technicians={technicians} />
      
      <div className="mb-6">
        <TechnicianFilters 
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          addCategory={addCategory}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          technicians={technicians}
          selectedTechnicians={selectedTechnicians}
          onTechnicianToggle={toggleTechnician}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          date={dateRange}
          setDate={setDateRange}
          departments={departments}
          selectedDepartments={selectedDepartments}
          toggleDepartment={toggleDepartment}
        />
      </div>
      
      <TechnicianCircleCharts filteredTechnicians={filteredTechnicians} />
      
      <TechniciansList 
        technicians={filteredTechnicians}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
        onEditTechnician={handleEditTechnician}
        showSalaryData={selectedDepartments.includes("Finance") || selectedDepartments.length === 0}
      />
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={handleAddTechnician}
      />

      <EditTechnicianModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateTechnician={handleUpdateTechnician}
        technician={selectedTechnician}
      />
    </div>
  );
};

export default Technicians;
