
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardListIcon, UsersIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart } from "@/components/DonutChart";

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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Tickets By Status</CardTitle>
        <div className="flex mt-2 space-x-2">
          <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Status</Badge>
          <Badge variant="outline" className="rounded-full">Map</Badge>
          <Badge variant="outline" className="rounded-full">Time</Badge>
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
