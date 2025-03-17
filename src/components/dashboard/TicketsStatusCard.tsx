
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardListIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/DonutChart";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TicketsStatusCardProps = {
  taskCounts: {
    joby: number;
    inProgress: number;
    submitted: number;
    draft: number;
    completed: number;
    canceled: number;
  };
  totalTasks: number;
  openDetailDialog: (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => void;
  detailedTasksData: any[];
};

const TicketsStatusCard = ({ 
  taskCounts, 
  totalTasks, 
  openDetailDialog,
  detailedTasksData
}: TicketsStatusCardProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  const [timeFilter, setTimeFilter] = useState<string>("all");

  // Format the date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMMM d, yyyy");
  };

  // Handle time filter change
  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    // Here you could filter the data based on the time filter
    // For now, we're just setting the state
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Tickets By Status</CardTitle>
        <div className="flex flex-wrap mt-2 space-x-2">
          <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Status</Badge>
          <Badge variant="outline" className="rounded-full">Map</Badge>
          
          {/* Time Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge variant="outline" className="rounded-full cursor-pointer flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Time</span>
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filter by time</h4>
                <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="lastWeek">Last Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge variant="outline" className="rounded-full cursor-pointer flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>Date</span>
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
              <div className="p-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Selected range: {formatDateRange()}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <DonutChart 
              data={[
                { name: "Joby", value: taskCounts.joby, color: "#3b82f6" },
                { name: "In Progress", value: taskCounts.inProgress, color: "#8b5cf6" },
                { name: "Submitted", value: taskCounts.submitted, color: "#6b7280" },
                { name: "Draft", value: taskCounts.draft, color: "#f97316" },
                { name: "Completed", value: taskCounts.completed, color: "#22c55e" },
                { name: "Canceled", value: taskCounts.canceled, color: "#ef4444" }
              ]}
              title={`${totalTasks}`}
              subtitle="Total Tickets"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                <BriefcaseIcon />
              </div>
              <div>
                <div className="font-medium">Joby</div>
                <div className="text-xl font-bold">{taskCounts.joby}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                <ClipboardListIcon />
              </div>
              <div>
                <div className="font-medium">In Progress</div>
                <div className="text-xl font-bold">{taskCounts.inProgress}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white mr-3">
                <UsersIcon />
              </div>
              <div>
                <div className="font-medium">Submitted</div>
                <div className="text-xl font-bold">{taskCounts.submitted}</div>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white mr-3">
                <ClipboardListIcon />
              </div>
              <div>
                <div className="font-medium">Draft</div>
                <div className="text-xl font-bold">{taskCounts.draft}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
              <CheckCircleIcon />
            </div>
            <div>
              <div className="font-medium">Completed</div>
              <div className="text-xl font-bold">{taskCounts.completed}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white mr-3">
              <XCircleIcon />
            </div>
            <div>
              <div className="font-medium">Canceled</div>
              <div className="text-xl font-bold">{taskCounts.canceled}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            className="text-blue-500"
            onClick={() => openDetailDialog('tasks', 'All Tickets', detailedTasksData)}
          >
            View All Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsStatusCard;
