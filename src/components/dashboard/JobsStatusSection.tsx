
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Jobs By Status</CardTitle>
        <p className="text-xs text-muted-foreground">Overview of service requests and job status</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="30" 
                strokeDasharray={`${2 * Math.PI * 80 * (taskCounts.completed / totalTasks)} ${2 * Math.PI * 80}`}
                strokeDashoffset={2 * Math.PI * 80 * 0.25}
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="30" 
                strokeDasharray={`${2 * Math.PI * 80 * (taskCounts.inProgress / totalTasks)} ${2 * Math.PI * 80}`}
                strokeDashoffset={2 * Math.PI * 80 * (0.25 - taskCounts.completed / totalTasks)}
              />
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="30" 
                strokeDasharray={`${2 * Math.PI * 80 * (taskCounts.canceled / totalTasks)} ${2 * Math.PI * 80}`}
                strokeDashoffset={2 * Math.PI * 80 * (0.25 - taskCounts.completed / totalTasks - taskCounts.inProgress / totalTasks)}
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-3xl font-bold">{totalTasks}</div>
              <div className="text-xs text-muted-foreground">Total Jobs</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 w-full">
            <div className="flex items-center justify-between p-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{taskCounts.completed}</span>
                <div className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.completed / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{taskCounts.inProgress}</span>
                <div className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.inProgress / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-red-50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{taskCounts.canceled}</span>
                <div className="text-xs bg-red-100 px-2 py-0.5 rounded-full">
                  {Math.round((taskCounts.canceled / totalTasks) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-purple-50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span>Rescheduled</span>
              </div>
              <div className="flex items-center gap-4">
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
