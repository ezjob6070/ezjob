
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import EditTechnicianModal from "@/components/technicians/EditTechnicianModal";

const TechnicianAltercation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);

  const handleUpdateTechnician = (values: any) => {
    // Convert form values to Technician type and ensure all required fields are present
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

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/technicians")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Technicians
        </Button>
        <h1 className="text-2xl font-bold">Technician Altercation Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map(tech => (
          <div 
            key={tech.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleEditTechnician(tech)}
          >
            <h3 className="font-medium">{tech.name}</h3>
            <p className="text-sm text-muted-foreground">{tech.specialty}</p>
          </div>
        ))}
      </div>

      {selectedTechnician && (
        <EditTechnicianModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onUpdateTechnician={handleUpdateTechnician}
          technician={selectedTechnician}
        />
      )}
    </div>
  );
};

export default TechnicianAltercation;
