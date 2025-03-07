
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { DateRange } from "react-day-picker";

interface TechnicianFiltersPanelProps {
  showFilters: boolean;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const TechnicianFiltersPanel: React.FC<TechnicianFiltersPanelProps> = ({
  showFilters,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  date,
  setDate
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
            <h3 className="text-sm font-medium mb-2">Filter by Date Range</h3>
            <DateRangeSelector date={date} setDate={setDate} />
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianFiltersPanel;
