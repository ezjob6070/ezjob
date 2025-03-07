
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FinanceFiltersPanelProps {
  showFilters: boolean;
  technicianNames: string[];
  jobSourceNames: string[];
  selectedTechnicians: string[];
  selectedJobSources: string[];
  toggleTechnician: (techName: string) => void;
  toggleJobSource: (sourceName: string) => void;
  clearFilters: () => void;
}

const FinanceFiltersPanel: React.FC<FinanceFiltersPanelProps> = ({
  showFilters,
  technicianNames,
  jobSourceNames,
  selectedTechnicians,
  selectedJobSources,
  toggleTechnician,
  toggleJobSource,
  clearFilters
}) => {
  if (!showFilters) return null;
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Technician</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {technicianNames.map((techName) => (
                <div key={techName} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tech-${techName}`} 
                    checked={selectedTechnicians.includes(techName)}
                    onCheckedChange={() => toggleTechnician(techName)}
                  />
                  <label 
                    htmlFor={`tech-${techName}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {techName}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Job Source</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {jobSourceNames.map((sourceName) => (
                <div key={sourceName} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`source-${sourceName}`} 
                    checked={selectedJobSources.includes(sourceName)}
                    onCheckedChange={() => toggleJobSource(sourceName)}
                  />
                  <label 
                    htmlFor={`source-${sourceName}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {sourceName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceFiltersPanel;
