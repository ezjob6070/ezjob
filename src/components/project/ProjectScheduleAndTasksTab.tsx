
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import TasksView from "@/components/schedule/TasksView";
import { Project, ProjectStaff } from "@/types/project";
import { Task } from "@/components/calendar/types";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

const ProjectScheduleAndTasksTab = ({ project, projectStaff }: ProjectScheduleAndTasksTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Sample tasks for the project
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "Site inspection",
      description: "Initial site inspection and assessment",
      status: "completed",
      priority: "high",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      assignedTo: "John Doe",
      client: { name: "ABC Corp" },
      createdAt: format(addDays(new Date(), -5), "yyyy-MM-dd"),
      progress: 100,
      isReminder: false,
    },
    {
      id: "task-2",
      title: "Material delivery",
      description: "Delivery of construction materials",
      status: "in_progress",
      priority: "medium",
      dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      assignedTo: "Sarah Smith",
      client: { name: "DEF Inc" },
      createdAt: format(addDays(new Date(), -3), "yyyy-MM-dd"),
      progress: 50,
      isReminder: false,
    },
    {
      id: "task-3",
      title: "Client meeting",
      description: "Progress review with client",
      status: "pending",
      priority: "high",
      dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      assignedTo: "Mark Johnson",
      client: { name: "GHI Ltd" },
      createdAt: format(addDays(new Date(), -2), "yyyy-MM-dd"),
      progress: 0,
      isReminder: true,
    },
    {
      id: "task-4",
      title: "Electrical work",
      description: "Complete electrical installations",
      status: "pending",
      priority: "medium",
      dueDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      assignedTo: "Robert Brown",
      client: { name: "JKL Co" },
      createdAt: format(addDays(new Date(), -1), "yyyy-MM-dd"),
      progress: 0,
      isReminder: false,
    },
    {
      id: "task-5",
      title: "Quality check",
      description: "Final quality inspection",
      status: "pending",
      priority: "high",
      dueDate: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      assignedTo: "Jennifer Lee",
      client: { name: "MNO Corp" },
      createdAt: format(new Date(), "yyyy-MM-dd"),
      progress: 0,
      isReminder: false,
    }
  ];
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handlePreviousDay = () => {
    const prevDay = addDays(selectedDate, -1);
    setSelectedDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
  };
  
  const handleTasksChange = (updatedTasks: Task[]) => {
    // This would update tasks in a real application
    console.log("Tasks updated:", updatedTasks);
  };

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  // Calculate metrics
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Tasks</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-xs font-medium text-blue-800 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-blue-900">{totalTasks}</div>
            <div className="text-xs text-blue-700 mt-1">Project scheduled tasks</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-xs font-medium text-emerald-800 mb-1">Completed</div>
            <div className="text-2xl font-bold text-emerald-900">{completedTasks}</div>
            <div className="text-xs text-emerald-700 mt-1">{Math.round((completedTasks/totalTasks)*100)}% of total tasks</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="pt-6">
            <div className="text-xs font-medium text-indigo-800 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-indigo-900">{inProgressTasks}</div>
            <div className="text-xs text-indigo-700 mt-1">{Math.round((inProgressTasks/totalTasks)*100)}% of total tasks</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="text-xs font-medium text-amber-800 mb-1">Pending Tasks</div>
            <div className="text-2xl font-bold text-amber-900">{pendingTasks}</div>
            <div className="text-xs text-amber-700 mt-1">{Math.round((pendingTasks/totalTasks)*100)}% of total tasks</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tasks View */}
      <TasksView
        selectedDate={selectedDate}
        tasksForSelectedDate={tasksForSelectedDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
        onTasksChange={handleTasksChange}
      />
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
