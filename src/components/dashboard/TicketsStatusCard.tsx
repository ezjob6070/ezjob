
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircleIcon, 
  ClipboardIcon, 
  ClockIcon, 
  XCircleIcon, 
  BriefcaseIcon,
  MoreHorizontalIcon,
  CalendarIcon
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
    completed: number;
    canceled: number;
    rescheduled: number;
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
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-2 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-blue-800">Jobs By Status</CardTitle>
          <div className="flex space-x-1">
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 rounded-full px-3">
              {totalTasks} Total
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap mt-2 space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Badge variant="outline" className="rounded-full cursor-pointer flex items-center gap-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                <CalendarIcon className="h-3 w-3" />
                <span>Date Range</span>
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Badge variant="outline" className="rounded-full cursor-pointer flex items-center gap-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                <ClockIcon className="h-3 w-3" />
                <span>Time Period</span>
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
          
          <Badge variant="outline" className="rounded-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
            <MoreHorizontalIcon className="h-3 w-3" />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-6 pt-4">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <DonutChart 
              data={[
                { name: "New Jobs", value: taskCounts.joby, color: "#3b82f6" },
                { name: "In Progress", value: taskCounts.inProgress, color: "#8b5cf6" },
                { name: "Completed", value: taskCounts.completed, color: "#22c55e" },
                { name: "Canceled", value: taskCounts.canceled, color: "#ef4444" },
                { name: "Rescheduled", value: taskCounts.rescheduled, color: "#ec4899" }
              ]}
              title={`${totalTasks}`}
              subtitle="Total Jobs"
            />
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="flex items-center p-3 rounded-lg bg-white shadow-sm border border-blue-100 transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                <BriefcaseIcon size={18} />
              </div>
              <div>
                <div className="text-xs text-blue-700 font-semibold">New Jobs</div>
                <div className="text-xl font-bold text-gray-800">{taskCounts.joby}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-white shadow-sm border border-purple-100 transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                <ClockIcon size={18} />
              </div>
              <div>
                <div className="text-xs text-purple-700 font-semibold">In Progress</div>
                <div className="text-xl font-bold text-gray-800">{taskCounts.inProgress}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-white shadow-sm border border-green-100 transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                <CheckCircleIcon size={18} />
              </div>
              <div>
                <div className="text-xs text-green-700 font-semibold">Completed</div>
                <div className="text-xl font-bold text-gray-800">{taskCounts.completed}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-white shadow-sm border border-red-100 transition-all hover:shadow-md">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white mr-3">
                <XCircleIcon size={18} />
              </div>
              <div>
                <div className="text-xs text-red-700 font-semibold">Canceled</div>
                <div className="text-xl font-bold text-gray-800">{taskCounts.canceled}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-white shadow-sm border border-pink-100 transition-all hover:shadow-md col-span-2">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white mr-3">
                <ClockIcon size={18} className="rotate-45" />
              </div>
              <div>
                <div className="text-xs text-pink-700 font-semibold">Rescheduled</div>
                <div className="text-xl font-bold text-gray-800">{taskCounts.rescheduled}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
            onClick={() => openDetailDialog('tasks', 'All Jobs', detailedTasksData)}
          >
            View Detailed Job Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsStatusCard;
