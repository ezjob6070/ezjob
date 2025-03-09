
import { useState } from "react";
import { Technician } from "@/types/technician";
import { initialTechnicians } from "@/data/technicians";
import TechniciansList from "@/components/technicians/TechniciansList";
import TechnicianTabs from "@/components/technicians/TechnicianTabs";

const TechnicianAltercation = () => {
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
      <TechnicianTabs currentTab="list" />

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
