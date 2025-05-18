
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TasksProvider } from "@/components/tasks/TasksContext";
import TaskMetrics from "@/components/tasks/TaskMetrics";
import TaskProgressBar from "@/components/tasks/TaskProgressBar";
import TaskList from "@/components/tasks/TaskList";
import TaskDetail from "@/components/tasks/TaskDetail";
import TaskForm from "@/components/tasks/TaskForm";

const TasksAndProgress = () => {
  return (
    <TasksProvider>
      <div className="space-y-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">Tasks and Progress</h1>
              <p className="text-gray-600 text-sm">Manage and track all project tasks</p>
            </div>
            
            <TaskDialogs />
          </div>
        </div>

        {/* Progress overview */}
        <TaskMetrics />
        
        {/* Overall progress bar */}
        <TaskProgressBar />

        {/* Task list with filters */}
        <TaskList />
      </div>
    </TasksProvider>
  );
};

const TaskDialogs = () => {
  const { 
    isTaskDialogOpen, 
    setIsTaskDialogOpen,
    isNewTaskDialogOpen,
    setIsNewTaskDialogOpen
  } = React.useContext(require("@/components/tasks/TasksContext").TasksContext);
  
  return (
    <>
      <Button onClick={() => setIsNewTaskDialogOpen(true)} className="flex items-center gap-2">
        <Plus size={16} />
        Add New Task
      </Button>
      
      {/* Task detail dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <TaskDetail />
      </Dialog>
      
      {/* New task dialog */}
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <TaskForm isNew={true} />
      </Dialog>
    </>
  );
};

export default TasksAndProgress;
