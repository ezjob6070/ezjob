
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTasks } from "./TasksContext";

const TaskMetrics: React.FC = () => {
  const { statusCounts } = useTasks();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-blue-900">{statusCounts.total}</span>
            <ClipboardList className="text-blue-500 mb-1" size={20} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-green-900">{statusCounts.completed}</span>
            <CheckCircle className="text-green-500 mb-1" size={20} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-amber-900">{statusCounts.inProgress}</span>
            <Clock className="text-amber-500 mb-1" size={20} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-purple-900">{statusCounts.pending}</span>
            <AlertCircle className="text-purple-500 mb-1" size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskMetrics;
