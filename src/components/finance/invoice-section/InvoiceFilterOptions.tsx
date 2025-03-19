
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DateRangeSelector from "@/components/finance/DateRangeSelector";

interface DisplayOptions {
  showJobAddress: boolean;
  showJobDate: boolean;
  showTechnicianEarnings: boolean;
  showCompanyProfit: boolean;
  showPartsValue: boolean;
  showDetails: boolean;
  showTechnicianRate: boolean;
  showJobBreakdown: boolean;
  showTotalSummary: boolean;
}

interface InvoiceFilterOptionsProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  jobStatus: string;
  setJobStatus: (status: string) => void;
  displayOptions: DisplayOptions;
  onDisplayOptionChange: (option: string, checked: boolean) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  handleDatePresetSelection: (preset: string) => void;
}

const InvoiceFilterOptions: React.FC<InvoiceFilterOptionsProps> = ({
  date,
  setDate,
  jobStatus,
  setJobStatus,
  displayOptions,
  onDisplayOptionChange,
  onClose,
  onReset,
  onApply,
  handleDatePresetSelection,
}) => {
  return (
    <Card className="border-blue-200 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-blue-700">Invoice Filter Options</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Date Range Selection */}
          <div className="space-y-2">
            <FormLabel>Date Range</FormLabel>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Past Periods</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("today")}>
                      Today
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("yesterday")}>
                      Yesterday
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("this-week")}>
                      This Week
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("last-week")}>
                      Last Week
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("this-month")}>
                      This Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("last-month")}>
                      Last Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("last-30-days")}>
                      Last 30 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("last-90-days")}>
                      Last 90 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDatePresetSelection("last-year")}>
                      Last Year
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DateRangeSelector date={date} setDate={setDate} />
            </div>
          </div>

          <Separator />
          
          {/* Job Status Filter */}
          <div className="space-y-2">
            <FormLabel>Job Status</FormLabel>
            <Select 
              value={jobStatus}
              onValueChange={setJobStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="completed">Completed Jobs</SelectItem>
                <SelectItem value="in_progress">In Progress Jobs</SelectItem>
                <SelectItem value="scheduled">Scheduled Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          {/* Display Options */}
          <div className="space-y-2">
            <FormLabel>Display Options</FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DisplayOptionSwitch 
                label="Job Address" 
                optionKey="showJobAddress" 
                checked={displayOptions.showJobAddress} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Job Date" 
                optionKey="showJobDate" 
                checked={displayOptions.showJobDate} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Technician Earnings" 
                optionKey="showTechnicianEarnings" 
                checked={displayOptions.showTechnicianEarnings} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Company Profit" 
                optionKey="showCompanyProfit" 
                checked={displayOptions.showCompanyProfit} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Parts Value" 
                optionKey="showPartsValue" 
                checked={displayOptions.showPartsValue} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Job Details" 
                optionKey="showDetails" 
                checked={displayOptions.showDetails} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Technician Rate" 
                optionKey="showTechnicianRate" 
                checked={displayOptions.showTechnicianRate} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Job Breakdown" 
                optionKey="showJobBreakdown" 
                checked={displayOptions.showJobBreakdown} 
                onChange={onDisplayOptionChange} 
              />
              <DisplayOptionSwitch 
                label="Total Summary" 
                optionKey="showTotalSummary" 
                checked={displayOptions.showTotalSummary} 
                onChange={onDisplayOptionChange} 
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
        <Button onClick={onApply}>
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

interface DisplayOptionSwitchProps {
  label: string;
  optionKey: string;
  checked: boolean;
  onChange: (option: string, checked: boolean) => void;
}

const DisplayOptionSwitch: React.FC<DisplayOptionSwitchProps> = ({
  label,
  optionKey,
  checked,
  onChange
}) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <FormLabel>{label}</FormLabel>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => onChange(optionKey, checked)}
      />
    </div>
  );
};

export default InvoiceFilterOptions;
