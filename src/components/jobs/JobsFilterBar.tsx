
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJobsContext } from "./context/JobsContext";
import TechnicianFilterDropdown from "./filters/TechnicianFilterDropdown";
import { FilterGroup } from "./JobTypes";

const JobsFilterBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    toggleTechnician,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectedContractors,
    toggleContractor,
    selectAllContractors,
    deselectAllContractors,
    selectedJobSources,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources,
    hasActiveFilters,
    clearFilters,
  } = useJobsContext();

  // Group technicians by role for dropdown
  const technicianGroups: FilterGroup[] = [
    {
      name: "Technicians",
      filters: [
        { name: "John Smith", selected: selectedTechnicians.includes("John Smith"), role: "HVAC" },
        { name: "Mike Johnson", selected: selectedTechnicians.includes("Mike Johnson"), role: "Plumbing" },
        { name: "Sarah Williams", selected: selectedTechnicians.includes("Sarah Williams"), role: "Electrical" },
      ]
    },
    {
      name: "Contractors",
      filters: [
        { name: "ABC Contractors", selected: selectedContractors.includes("ABC Contractors"), role: "Contractor" },
        { name: "XYZ Services", selected: selectedContractors.includes("XYZ Services"), role: "Contractor" },
      ]
    }
  ];

  return (
    <div className="bg-white p-4 rounded-md border mb-4 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search jobs by client, address, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <TechnicianFilterDropdown
          technicianGroups={technicianGroups}
          selectedTechnicians={[...selectedTechnicians, ...selectedContractors]}
          onToggleTechnician={(name) => {
            // Check if the name is in the contractors list
            if (technicianGroups[1].filters.some(c => c.name === name)) {
              toggleContractor(name);
            } else {
              toggleTechnician(name);
            }
          }}
          onSelectAll={() => {
            selectAllTechnicians();
            selectAllContractors();
          }}
          onDeselectAll={() => {
            deselectAllTechnicians();
            deselectAllContractors();
          }}
        />

        <Button
          variant="outline"
          onClick={() => clearFilters()}
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default JobsFilterBar;
