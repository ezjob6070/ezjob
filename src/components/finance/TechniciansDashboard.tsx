
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import TechnicianSearchFilter from "./technician-filters/TechnicianSearchFilter";
import TechnicianFilters from "./technician-filters/TechnicianFilters";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import TechnicianPerformanceMetrics from "@/components/technicians/charts/TechnicianPerformanceMetrics";
import TechnicianCircleCharts from "@/components/technicians/TechnicianCircleCharts";
import { searchTechnician } from "./technician-filters/TechnicianUtils";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date()
  });
  
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(activeTechnicians);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Get technician names for filters
  const technicianNames = activeTechnicians.map(tech => tech.name);
  const categories = Array.from(new Set(activeTechnicians.map(tech => tech.category || "Uncategorized")));
  
  // Use the hook for technician financials
  const {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    selectedTechnician,
    localDateRange,
    setLocalDateRange,
    displayedTechnicians,
    financialMetrics,
    selectedTechnicianMetrics,
    toggleTechnician,
    clearFilters,
    applyFilters,
    handleTechnicianSelect
  } = useTechnicianFinancials(filteredTechnicians, dateRange);
  
  // Filter technicians by search query
  useEffect(() => {
    const filtered = activeTechnicians.filter(tech => 
      searchTechnician(tech, searchQuery)
    );
    setFilteredTechnicians(filtered);
  }, [activeTechnicians, searchQuery]);

  return (
    <div className="space-y-8">
      <TechnicianFilters
        date={localDateRange}
        setDate={setLocalDateRange}
        selectedTechnicians={selectedTechnicianNames}
        // Match the Job Source pattern with a wrapper function
        setSelectedTechnicians={(techNames) => {
          if (typeof techNames === 'function') {
            // Handle the function case (React's setState can take a function)
            const newNames = techNames(selectedTechnicianNames);
            newNames.forEach(name => toggleTechnician(name));
          } else {
            // Handle direct array assignment
            const toAdd = techNames.filter(name => !selectedTechnicianNames.includes(name));
            const toRemove = selectedTechnicianNames.filter(name => !techNames.includes(name));
            
            toAdd.forEach(name => toggleTechnician(name));
            toRemove.forEach(name => toggleTechnician(name));
          }
        }}
        technicianNames={technicianNames}
        paymentTypeFilter={paymentTypeFilter}
        setPaymentTypeFilter={setPaymentTypeFilter}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        clearFilters={clearFilters}
      />
      
      <TechnicianCircleCharts 
        filteredTechnicians={filteredTechnicians} 
        dateRange={dateRange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Financial metrics for all technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <TechnicianSearchFilter 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <TechnicianFinancialTable
            filteredTechnicians={filteredTechnicians}
            displayedTechnicians={displayedTechnicians}
            selectedTechnicianNames={selectedTechnicianNames}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            paymentTypeFilter={paymentTypeFilter}
            setPaymentTypeFilter={setPaymentTypeFilter}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
            onTechnicianSelect={handleTechnicianSelect}
            selectedTechnicianId={selectedTechnician?.id}
          />
        </CardContent>
      </Card>
      
      {selectedTechnician && (
        <Card>
          <CardHeader>
            <CardTitle>Technician Details: {selectedTechnician.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <TechnicianPerformanceMetrics 
              technician={selectedTechnician}
              metrics={selectedTechnicianMetrics}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechniciansDashboard;
