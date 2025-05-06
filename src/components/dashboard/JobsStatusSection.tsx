
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LoaderCircle, XCircle, RotateCw } from "lucide-react";
import EnhancedDonutChart from "@/components/EnhancedDonutChart";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";

interface JobsStatusSectionProps {
  taskCounts: {
    completed: number;
    inProgress: number;
    canceled: number;
    rescheduled: number;
  };
  totalTasks: number;
  dateRangeText?: string;
}

const JobsStatusSection: React.FC<JobsStatusSectionProps> = ({ 
  taskCounts, 
  totalTasks,
  dateRangeText = "Custom Range" 
}) => {
  // State for the dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState("");

  // Convert task counts to format needed for donut chart
  const chartData = [
    { name: "Completed", value: taskCounts.completed, color: "#22c55e", gradientFrom: "#22c55e", gradientTo: "#4ade80" },
    { name: "In Progress", value: taskCounts.inProgress, color: "#3b82f6", gradientFrom: "#3b82f6", gradientTo: "#60a5fa" },
    { name: "Canceled", value: taskCounts.canceled, color: "#ef4444", gradientFrom: "#ef4444", gradientTo: "#f87171" },
    { name: "Rescheduled", value: taskCounts.rescheduled, color: "#a855f7", gradientFrom: "#a855f7", gradientTo: "#c084fc" }
  ];

  // Sample data for our dialog - in a real app, this would come from an API or props
  const generateMockTasksData = (status: string, count: number) => {
    const statusMap: Record<string, string> = {
      "completed": "completed",
      "in_progress": "in_progress",
      "cancelled": "cancelled",
      "rescheduled": "rescheduled"
    };
    
    const tasks = [];
    for (let i = 1; i <= count; i++) {
      tasks.push({
        title: `${status} Job ${i}`,
        client: `Client ${i}`,
        status: statusMap[status.toLowerCase().replace(' ', '_')],
        due: new Date(Date.now() + (i * 86400000)).toLocaleDateString()
      });
    }
    return tasks;
  };

  // Handle clicking on a status card
  const handleViewStatus = (status: string, count: number) => {
    if (count === 0) return; // Don't open dialog if no tasks
    
    setSelectedStatus(status.toLowerCase().replace(' ', '_'));
    setDialogTitle(`${status} Jobs`);
    setDialogOpen(true);
  };

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base">Jobs By Status</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of service requests and job status • {dateRangeText}</p>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex flex-row items-start gap-4">
          {/* Donut Chart - Left side */}
          <div className="relative w-[180px] flex-shrink-0">
            <EnhancedDonutChart 
              data={chartData}
              title={totalTasks.toString()}
              subtitle="Total Jobs"
              size={180}
              thickness={40}
              showLegend={false}
              animation={true}
            />
          </div>
          
          {/* Status Items - Right side in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {/* Completed */}
            <div className="flex flex-col rounded-lg border border-gray-100 p-2 cursor-pointer hover:border-green-300 transition-colors" 
                 onClick={() => handleViewStatus("Completed", taskCounts.completed)}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="font-medium text-sm">Completed</span>
                <span className="ml-auto text-sm">{taskCounts.completed}</span>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-1.5">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-green-500 rounded-full" 
                  style={{ width: `${Math.round((taskCounts.completed / totalTasks) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-1.5 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700">
                  {Math.round((taskCounts.completed / totalTasks) * 100)}%
                </span>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">View</Button>
              </div>
            </div>
            
            {/* In Progress */}
            <div className="flex flex-col rounded-lg border border-gray-100 p-2 cursor-pointer hover:border-blue-300 transition-colors" 
                 onClick={() => handleViewStatus("In Progress", taskCounts.inProgress)}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="font-medium text-sm">In Progress</span>
                <span className="ml-auto text-sm">{taskCounts.inProgress}</span>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-1.5">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-blue-500 rounded-full" 
                  style={{ width: `${Math.round((taskCounts.inProgress / totalTasks) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-1.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                  {Math.round((taskCounts.inProgress / totalTasks) * 100)}%
                </span>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">View</Button>
              </div>
            </div>
            
            {/* Cancelled */}
            <div className="flex flex-col rounded-lg border border-gray-100 p-2 cursor-pointer hover:border-red-300 transition-colors" 
                 onClick={() => handleViewStatus("Canceled", taskCounts.canceled)}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="font-medium text-sm">Cancelled</span>
                <span className="ml-auto text-sm">{taskCounts.canceled}</span>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-1.5">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-red-500 rounded-full" 
                  style={{ width: `${Math.round((taskCounts.canceled / totalTasks) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-1.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700">
                  {Math.round((taskCounts.canceled / totalTasks) * 100)}%
                </span>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">View</Button>
              </div>
            </div>
            
            {/* Rescheduled */}
            <div className="flex flex-col rounded-lg border border-gray-100 p-2 cursor-pointer hover:border-purple-300 transition-colors" 
                 onClick={() => handleViewStatus("Rescheduled", taskCounts.rescheduled)}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                <span className="font-medium text-sm">Rescheduled</span>
                <span className="ml-auto text-sm">{taskCounts.rescheduled}</span>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-1.5">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-purple-500 rounded-full" 
                  style={{ width: `${Math.round((taskCounts.rescheduled / totalTasks) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-1.5 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                  {Math.round((taskCounts.rescheduled / totalTasks) * 100)}%
                </span>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">View</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Dialog */}
        <DashboardDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={dialogTitle}
          type="tasks"
          data={selectedStatus ? generateMockTasksData(selectedStatus, 
            selectedStatus === "completed" ? taskCounts.completed :
            selectedStatus === "in_progress" ? taskCounts.inProgress :
            selectedStatus === "cancelled" ? taskCounts.canceled :
            taskCounts.rescheduled) : []}
        />
      </CardContent>
    </Card>
  );
};

export default JobsStatusSection;
