
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import { useToast } from "@/components/ui/use-toast";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const TechnicianAltercation = () => {
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

  // Extract unique categories from technicians
  const categories = useMemo(() => {
    const allCategories = technicians
      .map(tech => tech.category || "Uncategorized")
      .filter((value, index, self) => self.indexOf(value) === index);
    return allCategories;
  }, [technicians]);

  const filteredTechnicians = technicians.filter(tech => {
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
  });

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setShowEditModal(true);
  };

  const handleUpdateTechnician = (updatedTechnician: Technician) => {
    setTechnicians(prev => 
      prev.map(tech => tech.id === updatedTechnician.id ? updatedTechnician : tech)
    );
    
    toast({
      title: "Technician Updated",
      description: `${updatedTechnician.name}'s information has been updated.`,
    });
  };

  const handleAddTechnician = () => {
    setSelectedTechnician(null);
    setShowEditModal(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
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

  const toggleTechnician = (technicianId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianId)) {
        return prev.filter(id => id !== technicianId);
      } else {
        return [...prev, technicianId];
      }
    });
  };

  const addCategory = (category: string) => {
    toast({
      title: "Category Added",
      description: `New category "${category}" has been added.`,
    });
    // In a real app, you would update the database here
  };

  return (
    <div className="container py-8">
      {/* Main Technician Navigation Tabs */}
      <TechnicianTabs currentTab="list" />

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all technicians and their performance records
          </p>
        </div>
        
        <Button onClick={handleAddTechnician} size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Technician
        </Button>
      </div>

      {/* Technician Stats Section */}
      <TechnicianStats technicians={technicians} />

      {/* Integrated Filters Section */}
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
        />
      </div>

      {/* Technicians List without Integrated Search (moved to filters) */}
      <TechniciansList 
        technicians={filteredTechnicians} 
        onEditTechnician={handleEditTechnician}
        selectedTechnicians={selectedTechnicians}
        onToggleSelect={toggleTechnician}
      />

      {/* Edit Technician Modal */}
      <EditTechnicianModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateTechnician={handleUpdateTechnician}
        technician={selectedTechnician}
      />
    </div>
  );
};

export default TechnicianAltercation;
