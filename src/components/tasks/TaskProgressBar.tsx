
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTasks } from "./TasksContext";

const TaskProgressBar: React.FC = () => {
  const { overallProgress } = useTasks();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Overall Progress</CardTitle>
          <span className="font-bold text-lg">{overallProgress}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskProgressBar;
