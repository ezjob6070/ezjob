
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LoaderCircle, XCircle, RotateCw } from "lucide-react";

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
          <div className="relative w-60 h-60">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="white" stroke="#f0f0f0" strokeWidth="2" />
              
              {/* Completed - Green segment */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 40 * (taskCounts.completed / totalTasks)} ${2 * Math.PI * 40}`} 
                strokeDashoffset="0" 
                transform="rotate(-90 50 50)" 
              />
              
              {/* In Progress - Blue segment */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 40 * (taskCounts.inProgress / totalTasks)} ${2 * Math.PI * 40}`} 
                strokeDashoffset={`${-2 * Math.PI * 40 * (taskCounts.completed / totalTasks)}`} 
                transform="rotate(-90 50 50)" 
              />
              
              {/* Cancelled - Red segment */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 40 * (taskCounts.canceled / totalTasks)} ${2 * Math.PI * 40}`} 
                strokeDashoffset={`${-2 * Math.PI * 40 * ((taskCounts.completed + taskCounts.inProgress) / totalTasks)}`} 
                transform="rotate(-90 50 50)" 
              />
              
              {/* Rescheduled - Purple segment */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#a855f7" 
                strokeWidth="20" 
                strokeDasharray={`${2 * Math.PI * 40 * (taskCounts.rescheduled / totalTasks)} ${2 * Math.PI * 40}`} 
                strokeDashoffset={`${-2 * Math.PI * 40 * ((taskCounts.completed + taskCounts.inProgress + taskCounts.canceled) / totalTasks)}`} 
                transform="rotate(-90 50 50)" 
              />
              
              {/* Center text */}
              <text x="50" y="45" textAnchor="middle" fontSize="22" fontWeight="bold">{totalTasks}</text>
              <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#666">Total Jobs</text>
              
              {/* Completed count */}
              <text x="72" y="32" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#22c55e">{taskCounts.completed}</text>
              
              {/* In Progress count */}
              <text x="28" y="32" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b82f6">{taskCounts.inProgress}</text>
              
              {/* Cancelled count */}
              <text x="28" y="72" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ef4444">{taskCounts.canceled}</text>
              
              {/* Rescheduled count */}
              <text x="72" y="72" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a855f7">{taskCounts.rescheduled}</text>
            </svg>
          </div>
          
          <div className="grid grid-cols-1 gap-2 w-full">
            <div className="flex items-center justify-between p-2 rounded bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
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
                <LoaderCircle className="h-4 w-4 text-blue-500" />
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
                <XCircle className="h-4 w-4 text-red-500" />
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
                <RotateCw className="h-4 w-4 text-purple-500" />
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
