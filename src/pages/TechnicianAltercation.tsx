
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, BarChart2 } from "lucide-react";
import TechniciansList from "@/components/technicians/TechniciansList";
import { useState } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";

const TechnicianAltercation = () => {
  const navigate = useNavigate();
  const [technicians] = useState<Technician[]>(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTechnicians = technicians.filter(tech => {
    if (searchQuery === "") return true;
    
    return tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleEditTechnician = (technician: Technician) => {
    // This would typically open an edit modal or navigate to an edit page
    console.log("Edit technician:", technician);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container py-8">
      {/* Main Technician Navigation Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="list" 
              className="text-lg py-3 font-medium"
              onClick={() => navigate("/technicians")}
            >
              <List className="mr-2 h-5 w-5" />
              Technician List
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-lg py-3 font-medium"
              onClick={() => navigate("/technicians/analytics")}
            >
              <BarChart2 className="mr-2 h-5 w-5" />
              Technician Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all technicians and their performance records
          </p>
        </div>
      </div>

      {/* Technicians List */}
      <TechniciansList 
        technicians={filteredTechnicians} 
        onEditTechnician={handleEditTechnician}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default TechnicianAltercation;
