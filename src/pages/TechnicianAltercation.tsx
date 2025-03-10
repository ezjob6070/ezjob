
import { useState, useMemo } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";
import TechnicianFilters from "@/components/technicians/TechnicianFilters";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";
import { useToast } from "@/components/ui/use-toast";

const TechnicianAltercation = () => {
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

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
      </div>

      {/* Technician Filters */}
      <TechnicianFilters 
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        addCategory={addCategory}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Technicians List */}
      <TechniciansList 
        technicians={filteredTechnicians} 
        onEditTechnician={handleEditTechnician}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategories={selectedCategories}
        selectedStatus={statusFilter}
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
