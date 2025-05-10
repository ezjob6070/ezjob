import React, { useState } from 'react';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { DateRange } from 'react-day-picker';

interface CustomFilterDialogContentProps {
  title?: string;
  onCancel: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
  showTechnicianSelector?: boolean;
  technicianOptions?: { id: string; name: string }[];
  selectedTechnicians?: string[];
  toggleTechnician?: (id: string) => void;
  showCategorySelector?: boolean;
  categoryOptions?: string[];
  selectedCategories?: string[];
  toggleCategory?: (category: string) => void;
  showStatusSelector?: boolean;
  statusOptions?: string[];
  selectedStatuses?: string[];
  toggleStatus?: (status: string) => void;
  showDateRangeSelector?: boolean;
  initialDateRange?: DateRange | undefined;
  setDateRange?: (range: DateRange | undefined) => void;
  hasAllDayOption?: boolean;
  initialAllDay?: boolean;
  setAllDay?: (value: boolean) => void;
  allDay?: boolean;
}

const CustomFilterDialogContent = ({
  title,
  onCancel,
  onApply,
  initialFilters,
  showTechnicianSelector,
  technicianOptions,
  selectedTechnicians,
  toggleTechnician,
  showCategorySelector,
  categoryOptions,
  selectedCategories,
  toggleCategory,
  showStatusSelector,
  statusOptions,
  selectedStatuses,
  toggleStatus,
  showDateRangeSelector,
  initialDateRange,
  setDateRange,
  hasAllDayOption,
  initialAllDay,
  setAllDay,
  allDay,
}: CustomFilterDialogContentProps) => {
  const [dateRange, setLocalDateRange] = useState<DateRange | undefined>(initialDateRange);

  const applyFilters = () => {
    const filters = {
      selectedTechnicians,
      selectedCategories,
      selectedStatuses,
      dateRange,
      allDay,
    };
    onApply(filters);
  };

  return (
    <DialogContent className="max-w-screen-lg">
      <DialogHeader>
        <DialogTitle>{title || 'Filter Options'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Technician Selector */}
          {showTechnicianSelector && technicianOptions && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Technicians</h3>
              <div className="space-y-2">
                {technicianOptions.map((tech) => (
                  <label
                    key={tech.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedTechnicians?.includes(tech.id) || false}
                      onChange={() => toggleTechnician?.(tech.id)}
                    />
                    <span>{tech.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Category Selector */}
          {showCategorySelector && categoryOptions && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedCategories?.includes(category) || false}
                      onChange={() => toggleCategory?.(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Status Selector */}
          {showStatusSelector && statusOptions && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedStatuses?.includes(status) || false}
                      onChange={() => toggleStatus?.(status)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Middle Column */}
        <div className="space-y-4">
          {/* Custom Date Range */}
          {showDateRangeSelector && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Date Range</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      // Ensure range.from and range.to are properly handled
                      const newRange: DateRange = {
                        from: range.from,
                        to: range.to || range.from
                      };
                      setLocalDateRange(newRange);
                    } else {
                      setLocalDateRange(undefined);
                    }
                  }}
                  numberOfMonths={1}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          {/* Add any additional filter options here */}
          
          {/* Fix the checkbox handling issue */}
          {hasAllDayOption && (
            <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
              <label htmlFor="all-day" className="text-sm font-medium">
                All Day
              </label>
              <Switch
                id="all-day"
                checked={allDay}
                onCheckedChange={(value) => setAllDay?.(value)}
              />
            </div>
          )}
          
          {/* Add more options as needed */}
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CustomFilterDialogContent;
