
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, ArrowUpRight, ChevronRight } from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { format } from "date-fns";

type TicketsStatusCardProps = {
  taskCounts: {
    completed: number;
    inProgress: number;
    scheduled: number;
    cancelled: number;
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
  const { dateFilter } = useGlobalState();
  
  const getDateRangeText = () => {
    if (!dateFilter?.from) return "All time";
    
    if (!dateFilter.to || dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
      return format(dateFilter.from, "MMM d, yyyy");
    }
    
    return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <div>Jobs by Status</div>
          <div className="text-xs text-muted-foreground">{getDateRangeText()}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{taskCounts.completed}</span>
              <span className="text-xs text-muted-foreground">
                ({totalTasks > 0 ? Math.round((taskCounts.completed / totalTasks) * 100) : 0}%)
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-3 w-3 text-yellow-600" />
              </div>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{taskCounts.inProgress}</span>
              <span className="text-xs text-muted-foreground">
                ({totalTasks > 0 ? Math.round((taskCounts.inProgress / totalTasks) * 100) : 0}%)
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm">Scheduled</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{taskCounts.scheduled}</span>
              <span className="text-xs text-muted-foreground">
                ({totalTasks > 0 ? Math.round((taskCounts.scheduled / totalTasks) * 100) : 0}%)
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-3 w-3 text-red-600" />
              </div>
              <span className="text-sm">Cancelled</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{taskCounts.cancelled}</span>
              <span className="text-xs text-muted-foreground">
                ({totalTasks > 0 ? Math.round((taskCounts.cancelled / totalTasks) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => openDetailDialog('tasks', 'All Jobs', detailedTasksData)}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors group mt-4"
        >
          <span>View all jobs</span>
          <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardContent>
    </Card>
  );
};

export default TicketsStatusCard;
