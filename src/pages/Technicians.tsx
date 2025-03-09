
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
import { initialTechnicians } from "@/data/technicians";

const Technicians = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTechnicians = technicians.filter(tech => {
    if (searchQuery === "") return true;
    
    return tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.email.toLowerCase().includes(searchQuery.toLowerCase());
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
      
      {/* Financial Performance with Charts and Filters */}
      <TechnicianCircleCharts filteredTechnicians={filteredTechnicians} />
      
      {/* Technicians List */}
      <TechniciansList 
        technicians={filteredTechnicians} 
        onEditTechnician={handleEditTechnician}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
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
