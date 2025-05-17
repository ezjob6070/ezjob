import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List, Bell, Clock, BarChart } from "lucide-react";
import TasksView from "@/components/schedule/TasksView";
import { Project, ProjectStaff, ProjectTask } from "@/types/project";
import { Task } from "@/components/calendar/types";
import { addDays, format } from "date-fns";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff?: ProjectStaff[];
}

const ProjectScheduleAndTasksTab = ({ project, projectStaff }: ProjectScheduleAndTasksTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'tasks' | 'reminders' | 'timeline' | 'analytics'>('calendar');

  // Sample tasks for the project with proper client data
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "Site inspection",
      description: "Initial site inspection and assessment",
      status: "completed",
      priority: "high",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      assignedTo: "John Doe",
      createdAt: format(addDays(new Date(), -5), "yyyy-MM-dd"),
      progress: 100,
      isReminder: false,
      client: { name: `${project.clientName || 'Client'}` },
    },
    {
      id: "task-2",
      title: "Material delivery",
      description: "Delivery of construction materials",
      status: "in_progress",
      priority: "medium",
      dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      assignedTo: "Sarah Smith",
      createdAt: format(addDays(new Date(), -3), "yyyy-MM-dd"),
      progress: 50,
      isReminder: false,
      client: { name: `${project.clientName || 'Client'}` },
    },
    {
      id: "task-3",
      title: "Client meeting",
      description: "Progress review with client",
      status: "pending",
      priority: "high",
      dueDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      assignedTo: "Mark Johnson",
      createdAt: format(addDays(new Date(), -2), "yyyy-MM-dd"),
      progress: 0,
      isReminder: true,
      client: { name: `${project.clientName || 'Client'}` },
    },
    {
      id: "task-4",
      title: "Electrical work",
      description: "Complete electrical installations",
      status: "pending",
      priority: "medium",
      dueDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      assignedTo: "Robert Brown",
      createdAt: format(addDays(new Date(), -1), "yyyy-MM-dd"),
      progress: 0,
      isReminder: false,
      client: { name: `${project.clientName || 'Client'}` },
    },
    {
      id: "task-5",
      title: "Quality check",
      description: "Final quality inspection",
      status: "pending",
      priority: "high",
      dueDate: format(addDays(new Date(), 10), "yyyy-MM-dd"),
      assignedTo: "Jennifer Lee",
      createdAt: format(new Date(), "yyyy-MM-dd"),
      progress: 0,
      isReminder: false,
      client: { name: `${project.clientName || 'Client'}` },
    }
  ];
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
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

  const renderCalendarView = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Project Calendar</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="sm">Week</Button>
            <Button variant="outline" size="sm">Month</Button>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 h-80">
          <div className="text-center text-muted-foreground">
            Calendar view will be displayed here
          </div>
        </div>
      </div>
    );
  };

  const renderTasksView = () => {
    return (
      <TasksView 
        selectedDate={selectedDate}
        tasksForSelectedDate={tasksForSelectedDate}
        onPreviousDay={() => setSelectedDate(addDays(selectedDate, -1))}
        onNextDay={() => setSelectedDate(addDays(selectedDate, 1))}
        onTasksChange={handleTasksChange}
      />
    );
  };

  const renderRemindersView = () => {
    const reminders = tasks.filter(task => task.isReminder);
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Project Reminders</h3>
        {reminders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-muted-foreground">No reminders set for this project</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(reminder => (
              <Card key={reminder.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <Bell className="h-4 w-4 mr-2 text-amber-500" />
                        <h4 className="font-medium">{reminder.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500">{reminder.description}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      {format(new Date(reminder.dueDate), "MMM d")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTimelineView = () => {
    // Sort tasks by date for the timeline
    const sortedTasks = [...tasks].sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Project Timeline</h3>
        <div className="relative">
          {/* Timeline bar */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6 relative">
            {sortedTasks.map(task => (
              <div key={task.id} className="flex gap-4 relative">
                {/* Timeline node */}
                <div className={`w-3 h-3 rounded-full mt-1.5 z-10 flex-shrink-0 ${
                  task.status === "completed" ? "bg-green-500" :
                  task.status === "in_progress" ? "bg-blue-500" : "bg-gray-400"
                }`}></div>
                
                {/* Task card */}
                <Card className="flex-1 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge className={`mr-2 ${
                            task.priority === "high" ? "bg-red-100 text-red-800" :
                            task.priority === "medium" ? "bg-amber-100 text-amber-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <Badge className={`
                        ${task.status === "completed" ? "bg-green-100 text-green-800" : 
                          task.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"}
                      `}>
                        {task.status === "completed" ? "Completed" : 
                         task.status === "in_progress" ? "In Progress" : 
                         "Pending"}
                      </Badge>
                    </div>
                    
                    {task.progress !== undefined && task.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              task.status === "completed" ? "bg-green-500" :
                              "bg-blue-500"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsView = () => {
    // In a real application, this would show charts and analytics
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Project Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed</span>
                    <span>{tasks.filter(t => t.status === "completed").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.status === "completed").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Progress</span>
                    <span>{tasks.filter(t => t.status === "in_progress").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.status === "in_progress").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pending</span>
                    <span>{tasks.filter(t => t.status === "pending").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.status === "pending").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>High Priority</span>
                    <span>{tasks.filter(t => t.priority === "high").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.priority === "high").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Medium Priority</span>
                    <span>{tasks.filter(t => t.priority === "medium").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.priority === "medium").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Low Priority</span>
                    <span>{tasks.filter(t => t.priority === "low").length} tasks</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${(tasks.filter(t => t.priority === "low").length / tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(viewMode) {
      case 'calendar':
        return renderCalendarView();
      case 'tasks':
        return renderTasksView();
      case 'reminders':
        return renderRemindersView();
      case 'timeline':
        return renderTimelineView();
      case 'analytics':
        return renderAnalyticsView();
      default:
        return renderCalendarView();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule & Tasks</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      {/* Filter section with professional styling */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-medium text-gray-500">View Options</h3>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={viewMode === 'calendar' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              
              <Button 
                variant={viewMode === 'tasks' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${viewMode === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}
                onClick={() => setViewMode('tasks')}
              >
                <List className="h-4 w-4" />
                Tasks
              </Button>
              
              <Button 
                variant={viewMode === 'reminders' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${viewMode === 'reminders' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}
                onClick={() => setViewMode('reminders')}
              >
                <Bell className="h-4 w-4" />
                Reminders
              </Button>
              
              <Button 
                variant={viewMode === 'timeline' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}
                onClick={() => setViewMode('timeline')}
              >
                <Clock className="h-4 w-4" />
                Timeline
              </Button>
              
              <Button 
                variant={viewMode === 'analytics' ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}
                onClick={() => setViewMode('analytics')}
              >
                <BarChart className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Content area */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
