
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

interface FinanceFiltersPanelProps {
  showFilters: boolean;
  technicianNames: string[];
  jobSourceNames: string[];
  selectedTechnicians: string[];
  selectedJobSources: string[];
  toggleTechnician: (techName: string) => void;
  toggleJobSource: (sourceName: string) => void;
  clearFilters: () => void;
  date?: DateRange | undefined;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  applyFilters?: () => void;
  setShowFilters: (show: boolean) => void;
}

const FinanceFiltersPanel: React.FC<FinanceFiltersPanelProps> = ({
  showFilters,
  technicianNames,
  jobSourceNames,
  selectedTechnicians,
  selectedJobSources,
  toggleTechnician,
  toggleJobSource,
  clearFilters,
  date,
  setDate,
  applyFilters,
  setShowFilters
}) => {
  if (!showFilters) return null;
  
  return (
    <Card className="mb-4 shadow-md border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              Clear all
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicianNames.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Technicians</h3>
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
            )}
            
            {jobSourceNames.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Job Sources</h3>
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
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            {applyFilters && (
              <Button size="sm" onClick={applyFilters} className="ml-2">
                Apply Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceFiltersPanel;
