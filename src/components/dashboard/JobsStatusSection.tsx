
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
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col items-center">
            <EnhancedDonutChart 
              data={chartData}
              title={totalTasks.toString()}
              subtitle="Total Jobs"
              size={240}
              thickness={40}
              showLegend={false}
              animation={true}
            />
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between p-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.completed}</span>
                <div className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.completed / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-blue-50">
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 text-blue-500" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.inProgress}</span>
                <div className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.inProgress / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-red-50">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.canceled}</span>
                <div className="text-xs bg-red-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.canceled / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-purple-50">
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-purple-500" />
                <span>Rescheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{taskCounts.rescheduled}</span>
                <div className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.rescheduled / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsStatusSection;
