
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  contractorNames: string[];
  selectedContractors: string[];
  setSelectedContractors: (contractors: string[]) => void;
  salesmenNames: string[];
  selectedSalesmen: string[];
  setSelectedSalesmen: (salesmen: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  onApply: () => void;
  onReset: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  contractorNames,
  selectedContractors,
  setSelectedContractors,
  salesmenNames,
  selectedSalesmen,
  setSelectedSalesmen,
  dateRange,
  setDateRange,
  onApply,
  onReset
}) => {
  const toggleContractor = (contractor: string) => {
    setSelectedContractors(
      selectedContractors.includes(contractor)
        ? selectedContractors.filter(c => c !== contractor)
        : [...selectedContractors, contractor]
    );
  };

  const toggleSalesman = (salesman: string) => {
    setSelectedSalesmen(
      selectedSalesmen.includes(salesman)
        ? selectedSalesmen.filter(s => s !== salesman)
        : [...selectedSalesmen, salesman]
    );
  };

  const selectAllContractors = () => {
    setSelectedContractors([...contractorNames]);
  };

  const deselectAllContractors = () => {
    setSelectedContractors([]);
  };

  const selectAllSalesmen = () => {
    setSelectedSalesmen([...salesmenNames]);
  };

  const deselectAllSalesmen = () => {
    setSelectedSalesmen([]);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Contractors Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Contractors</h3>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllContractors}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={deselectAllContractors}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
              {contractorNames.length > 0 ? (
                contractorNames.map((contractor) => (
                  <div key={contractor} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`contractor-${contractor}`}
                      checked={selectedContractors.includes(contractor)}
                      onCheckedChange={() => toggleContractor(contractor)}
                    />
                    <label 
                      htmlFor={`contractor-${contractor}`}
                      className="text-sm"
                    >
                      {contractor}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-1">No contractors found</p>
              )}
            </div>
          </div>

          {/* Salesmen Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Sales Representatives</h3>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectAllSalesmen}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={deselectAllSalesmen}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
              {salesmenNames.length > 0 ? (
                salesmenNames.map((salesman) => (
                  <div key={salesman} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`salesman-${salesman}`}
                      checked={selectedSalesmen.includes(salesman)}
                      onCheckedChange={() => toggleSalesman(salesman)}
                    />
                    <label 
                      htmlFor={`salesman-${salesman}`}
                      className="text-sm"
                    >
                      {salesman}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-1">No sales representatives found</p>
              )}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Project Date Range</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRange(undefined)}
                className="h-7 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="border rounded-md p-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        {/* Filter Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onReset}>Reset Filters</Button>
          <Button onClick={onApply}>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFilters;
