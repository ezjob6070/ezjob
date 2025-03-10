
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusIcon, ListChecks } from "lucide-react";
import { Technician } from "@/types/technician";
import { Link } from "react-router-dom";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import { initialTechnicians } from "@/data/technicians";

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
  
  // Extract unique categories
  const categories = technicians
    .map(tech => tech.category || "Uncategorized")
    .filter((value, index, self) => self.indexOf(value) === index);

  // Apply all filters and sorting
  const filteredTechnicians = technicians
    .filter(tech => {
      // Text search filter
      const matchesSearch = searchQuery === "" || 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tech.phone && tech.phone.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(tech.category || "Uncategorized");
      
      // Status filter
      const matchesStatus = statusFilter === "all" || 
        tech.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
        case "oldest":
          return new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime();
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

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const addCategory = (category: string) => {
    toast({
      title: "Category Added",
      description: `New category "${category}" has been added.`,
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
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Technician
          </Button>
        </div>
      </div>

      <TechnicianStats technicians={technicians} />
      
      {/* Enhanced filters with sorting options */}
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
        />
      </div>
      
      {/* Financial Performance with Charts and Filters */}
      <TechnicianCircleCharts filteredTechnicians={filteredTechnicians} />
      
      {/* Technicians List with new table/card view toggle */}
      <TechniciansList 
        technicians={filteredTechnicians} 
        onEditTechnician={handleEditTechnician}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
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
