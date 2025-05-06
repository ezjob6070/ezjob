
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LoaderCircle, XCircle, RotateCw } from "lucide-react";
import EnhancedDonutChart from "@/components/EnhancedDonutChart";

interface JobsStatusSectionProps {
  taskCounts: {
    completed: number;
    inProgress: number;
    canceled: number;
    rescheduled: number;
  };
  totalTasks: number;
}

const JobsStatusSection: React.FC<JobsStatusSectionProps> = ({ 
  taskCounts, 
  totalTasks 
}) => {
  // Convert task counts to format needed for donut chart
  const chartData = [
    { name: "Completed", value: taskCounts.completed, color: "#22c55e", gradientFrom: "#22c55e", gradientTo: "#4ade80" },
    { name: "In Progress", value: taskCounts.inProgress, color: "#3b82f6", gradientFrom: "#3b82f6", gradientTo: "#60a5fa" },
    { name: "Canceled", value: taskCounts.canceled, color: "#ef4444", gradientFrom: "#ef4444", gradientTo: "#f87171" },
    { name: "Rescheduled", value: taskCounts.rescheduled, color: "#a855f7", gradientFrom: "#a855f7", gradientTo: "#c084fc" }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Jobs By Status</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of service requests and job status</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0 flex justify-center w-72 md:w-auto">
            <EnhancedDonutChart 
              data={chartData}
              title={totalTasks.toString()}
              subtitle="Total Jobs"
              size={200}
              thickness={40}
              showLegend={false}
              animation={true}
            />
          </div>
          
          {/* Status Items */}
          <div className="flex flex-col gap-3 w-full">
            {/* Completed */}
            <div className="flex items-center justify-between rounded bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.completed}</span>
                <div className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.completed / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">View</Button>
              </div>
            </div>
            
            {/* In Progress */}
            <div className="flex items-center justify-between rounded bg-blue-50 p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.inProgress}</span>
                <div className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.inProgress / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">View</Button>
              </div>
            </div>
            
            {/* Cancelled */}
            <div className="flex items-center justify-between rounded bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.canceled}</span>
                <div className="text-xs bg-red-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.canceled / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">View</Button>
              </div>
            </div>
            
            {/* Rescheduled */}
            <div className="flex items-center justify-between rounded bg-purple-50 p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Rescheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.rescheduled}</span>
                <div className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.rescheduled / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">View</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsStatusSection;
