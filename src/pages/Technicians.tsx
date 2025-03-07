
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Technician } from "@/types/technician";
import AddTechnicianModal from "@/components/technicians/AddTechnicianModal";
import TechnicianStats from "@/components/technicians/TechnicianStats";
import TechniciansList from "@/components/technicians/TechniciansList";
import { initialTechnicians } from "@/data/technicians";

const Technicians = () => {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);

  const handleAddTechnician = (newTechnician: Technician) => {
    setTechnicians((prevTechnicians) => [newTechnician, ...prevTechnicians]);
    toast({
      title: "Success",
      description: "New technician added successfully",
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
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Technician
        </Button>
      </div>

      <TechnicianStats technicians={technicians} />
      <TechniciansList technicians={technicians} />
      
      <AddTechnicianModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddTechnician={handleAddTechnician}
      />
    </div>
  );
};

export default Technicians;
