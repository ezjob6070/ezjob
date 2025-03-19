
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/hooks/useTechniciansData";
import TechnicianFinancialFilterBar from "@/components/technicians/charts/TechnicianFinancialFilterBar";
import TechnicianFinancialTableContent from "@/components/technicians/charts/TechnicianFinancialTableContent";
import { Calendar, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TechnicianFinancialTableProps {
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
}

const TechnicianFinancialTable = ({
  filteredTechnicians,
  displayedTechnicians,
  selectedTechnicianNames,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  onTechnicianSelect,
  selectedTechnicianId
}: TechnicianFinancialTableProps) => {
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high"); // Default sort by revenue high to low
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showTechnicianFilter, setShowTechnicianFilter] = useState(false);
  const [showPaymentFilter, setShowPaymentFilter] = useState(false);
  const technicianNames = displayedTechnicians.map(tech => tech.name);

  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };

  const formatDateRange = () => {
    if (localDateRange?.from) {
      if (localDateRange.to) {
        return `${format(localDateRange.from, "MMM d, yyyy")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
      }
      return format(localDateRange.from, "MMM d, yyyy");
    }
    return "Select date";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Technician Financial Performance</CardTitle>
        <CardDescription>
          Financial performance metrics for each technician in the selected time period.
        </CardDescription>
      </CardHeader>
      
      <TechnicianFinancialFilterBar
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      <CardContent>
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="text-sm font-medium">Filter and sort technicians</div>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              {/* Date Range Filter Button */}
              <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" side="bottom">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    selected={localDateRange}
                    onSelect={setLocalDateRange}
                    numberOfMonths={2}
                  />
                  <div className="flex items-center justify-between p-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setLocalDateRange(undefined);
                        setShowDateFilter(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setShowDateFilter(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Technician Filter Button */}
              <Popover open={showTechnicianFilter} onOpenChange={setShowTechnicianFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    Filter Technicians
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end" side="bottom">
                  <div className="p-4">
                    <div className="font-medium mb-2">Select Technicians</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {technicianNames.map(name => (
                        <div key={name} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`tech-${name}`}
                            className="mr-2"
                            checked={selectedTechnicianNames.includes(name)}
                            onChange={() => toggleTechnician(name)}
                          />
                          <label htmlFor={`tech-${name}`} className="text-sm">{name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setShowTechnicianFilter(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setShowTechnicianFilter(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Payment Rate Filter Button */}
              <Popover open={showPaymentFilter} onOpenChange={setShowPaymentFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-2">
                    <Filter className="h-4 w-4" />
                    Payment Rate
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="end" side="bottom">
                  <div className="p-4">
                    <div className="font-medium mb-2">Payment Type</div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="payment-all"
                          name="payment-type"
                          className="mr-2"
                          checked={paymentTypeFilter === "all"}
                          onChange={() => setPaymentTypeFilter("all")}
                        />
                        <label htmlFor="payment-all" className="text-sm">All Types</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="payment-percentage"
                          name="payment-type"
                          className="mr-2"
                          checked={paymentTypeFilter === "percentage"}
                          onChange={() => setPaymentTypeFilter("percentage")}
                        />
                        <label htmlFor="payment-percentage" className="text-sm">Percentage</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="payment-flat"
                          name="payment-type"
                          className="mr-2"
                          checked={paymentTypeFilter === "flat"}
                          onChange={() => setPaymentTypeFilter("flat")}
                        />
                        <label htmlFor="payment-flat" className="text-sm">Flat Rate</label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setPaymentTypeFilter("all");
                        setShowPaymentFilter(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setShowPaymentFilter(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear Filters Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>

              {/* Apply Filters Button */}
              <Button 
                variant="default" 
                size="sm" 
                className="h-10" 
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        <TechnicianFinancialTableContent
          displayedTechnicians={displayedTechnicians}
          onTechnicianSelect={onTechnicianSelect}
          selectedTechnicianId={selectedTechnicianId}
          localDateRange={localDateRange}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          Showing {displayedTechnicians.length} technicians
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechnicianFinancialTable;
