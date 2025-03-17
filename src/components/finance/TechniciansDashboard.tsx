
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import TechnicianDashboardHeader from "@/components/finance/dashboard/TechnicianDashboardHeader";
import FinancialChartSection from "@/components/finance/dashboard/FinancialChartSection";
import TechnicianPerformanceTable from "@/components/finance/dashboard/TechnicianPerformanceTable";

interface TechniciansDashboardProps {
  activeTechnicians: Technician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard: React.FC<TechniciansDashboardProps> = ({
  activeTechnicians,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    "Garage Door", "HVAC", "Electrical", "Plumbing", "Construction", "Others"
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const technicianNames = activeTechnicians.map(tech => tech.name);

  const filteredTechnicians = activeTechnicians.filter(tech => {
    const matchesSelectedTechnicians = 
      !appliedFilters || 
      selectedTechnicians.length === 0 || 
      selectedTechnicians.includes(tech.name);

    const matchesCategory = 
      selectedCategories.length === 0 || 
      (tech.category && selectedCategories.includes(tech.category)) ||
      (!tech.category && selectedCategories.includes("Others"));
    
    return matchesSelectedTechnicians && matchesCategory;
  });

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const selectAllTechnicians = () => {
    setSelectedTechnicians([...technicianNames]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    const resetToday = new Date();
    setDate({
      from: resetToday,
      to: resetToday
    });
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  return (
    <div className="space-y-8">
      <TechnicianDashboardHeader
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        toggleTechnician={toggleTechnician}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        addCategory={addCategory}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        date={date}
        setDate={setDate}
        selectAllTechnicians={selectAllTechnicians}
        deselectAllTechnicians={deselectAllTechnicians}
        appliedFilters={appliedFilters}
        filteredTechnicians={filteredTechnicians}
        activeTechnicians={activeTechnicians}
      />
      
      <FinancialChartSection 
        filteredTechnicians={filteredTechnicians}
        date={date}
      />
      
      <TechnicianPerformanceTable 
        filteredTechnicians={filteredTechnicians}
        selectedCategories={selectedCategories}
      />
    </div>
  );
};

export default TechniciansDashboard;
