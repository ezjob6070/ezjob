
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, CalendarDaysIcon, CheckIcon, DollarSignIcon } from "lucide-react";
import { Technician } from "@/types/technician";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TechnicianFilters from "../technician-filters/TechnicianFilters";
import { DateRange } from "react-day-picker";

interface TechnicianQuickSelectorProps {
  activeTechnicians: Technician[];
  selectedTechnicianId: string;
  handleTechnicianChange: (techId: string) => void;
  dateRangeText: string;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
}

const TechnicianQuickSelector: React.FC<TechnicianQuickSelectorProps> = ({
  activeTechnicians,
  selectedTechnicianId,
  handleTechnicianChange,
  dateRangeText,
  localDateRange,
  setLocalDateRange
}) => {
  // Get the specific technician details
  const selectedTechDetails = activeTechnicians.find(tech => tech.id === selectedTechnicianId);
  
  // Calculate completion rate for selected technician
  const completionRate = selectedTechDetails ? 
    Math.round((selectedTechDetails.completedJobs / (selectedTechDetails.completedJobs + selectedTechDetails.cancelledJobs)) * 100) : 0;

  return (
    <div className="mb-6 border rounded-lg p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-2">Select Technician for Quick View</h3>
          <Select value={selectedTechnicianId} onValueChange={handleTechnicianChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a technician" />
            </SelectTrigger>
            <SelectContent>
              {activeTechnicians.map(tech => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-2">Time Range</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                {dateRangeText || "Select date range"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <div className="p-2">
                <TechnicianFilters
                  date={localDateRange}
                  setDate={setLocalDateRange}
                  selectedTechnicians={[]}
                  setSelectedTechnicians={() => {}}
                  technicianNames={[]}
                  paymentTypeFilter=""
                  setPaymentTypeFilter={() => {}}
                  appliedFilters={false}
                  setAppliedFilters={() => {}}
                  clearFilters={() => {}}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {selectedTechDetails && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <UserIcon className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Technician</p>
                  <p className="text-sm font-medium">{selectedTechDetails.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <CalendarDaysIcon className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                  <p className="text-sm font-medium">{selectedTechDetails.completedJobs + selectedTechDetails.cancelledJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckIcon className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed Jobs</p>
                  <p className="text-sm font-medium">{selectedTechDetails.completedJobs} 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({completionRate}%)
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <DollarSignIcon className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedTechDetails.paymentType} 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({selectedTechDetails.paymentType === 'percentage' 
                        ? `${selectedTechDetails.paymentRate}%` 
                        : `$${selectedTechDetails.paymentRate}`})
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TechnicianQuickSelector;
