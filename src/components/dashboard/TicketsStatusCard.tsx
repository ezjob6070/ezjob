
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CircleProgress from "@/components/CircleProgress";

interface TicketsStatusCardProps {
  taskCounts: {
    new: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  totalTasks: number;
  detailedTasksData?: any[];
  dateRange?: DateRange | undefined;
}

const TicketsStatusCard: React.FC<TicketsStatusCardProps> = ({ 
  taskCounts, 
  totalTasks,
  detailedTasksData,
  dateRange
}) => {
  const formatDateRange = () => {
    if (!dateRange?.from) return "All Time";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Jobs by Status
          {dateRange?.from && (
            <span className="text-xs font-normal text-muted-foreground">
              {formatDateRange()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">New</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{taskCounts.new}</span>
              <CircleProgress 
                progress={Math.round((taskCounts.new / totalTasks) * 100)} 
                size={24} 
                strokeWidth={2.5} 
                color="#3b82f6" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{taskCounts.inProgress}</span>
              <CircleProgress 
                progress={Math.round((taskCounts.inProgress / totalTasks) * 100)} 
                size={24} 
                strokeWidth={2.5} 
                color="#f59e0b" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{taskCounts.completed}</span>
              <CircleProgress 
                progress={Math.round((taskCounts.completed / totalTasks) * 100)} 
                size={24} 
                strokeWidth={2.5} 
                color="#22c55e" 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-sm">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{taskCounts.cancelled}</span>
              <CircleProgress 
                progress={Math.round((taskCounts.cancelled / totalTasks) * 100)} 
                size={24} 
                strokeWidth={2.5} 
                color="#ef4444" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsStatusCard;
