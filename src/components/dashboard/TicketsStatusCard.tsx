
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleProgress } from "@/components/CircleProgress"; 

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

const TicketsStatusCard = ({ 
  taskCounts, 
  totalTasks,
  detailedTasksData,
  dateRange 
}: TicketsStatusCardProps) => {
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

  const completionRate = Math.round((taskCounts.completed / totalTasks) * 100);
  const inProgressRate = Math.round((taskCounts.inProgress / totalTasks) * 100);
  const newRate = Math.round((taskCounts.new / totalTasks) * 100);
  const cancelledRate = Math.round((taskCounts.cancelled / totalTasks) * 100);

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col items-center">
            <CircleProgress 
              value={completionRate} 
              strokeWidth={6}
              size={80}
              strokeColor="#16a34a"
            />
            <div className="text-center mt-2">
              <h3 className="text-sm font-medium">Completed</h3>
              <p className="text-xl font-bold text-green-600">{taskCounts.completed}</p>
              <p className="text-xs text-muted-foreground">{completionRate}% of total</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <CircleProgress 
              value={inProgressRate} 
              strokeWidth={6}
              size={80}
              strokeColor="#3b82f6"
            />
            <div className="text-center mt-2">
              <h3 className="text-sm font-medium">In Progress</h3>
              <p className="text-xl font-bold text-blue-600">{taskCounts.inProgress}</p>
              <p className="text-xs text-muted-foreground">{inProgressRate}% of total</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <CircleProgress 
              value={newRate} 
              strokeWidth={6}
              size={80}
              strokeColor="#8b5cf6"
            />
            <div className="text-center mt-2">
              <h3 className="text-sm font-medium">New</h3>
              <p className="text-xl font-bold text-purple-600">{taskCounts.new}</p>
              <p className="text-xs text-muted-foreground">{newRate}% of total</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <CircleProgress 
              value={cancelledRate} 
              strokeWidth={6}
              size={80}
              strokeColor="#f43f5e"
            />
            <div className="text-center mt-2">
              <h3 className="text-sm font-medium">Cancelled</h3>
              <p className="text-xl font-bold text-rose-600">{taskCounts.cancelled}</p>
              <p className="text-xs text-muted-foreground">{cancelledRate}% of total</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsStatusCard;
