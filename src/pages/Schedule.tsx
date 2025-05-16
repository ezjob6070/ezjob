
import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { 
  isSameDay, format, isToday, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, addMonths, subMonths,
  addWeeks, subWeeks, addDays, subDays
} from "date-fns";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Clock, AlarmClock, Bell, Briefcase, ListTodo } from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import CalendarViewOptions, { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TasksView from "@/components/schedule/TasksView";
import CalendarView from "@/components/schedule/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Schedule = () => {
  const { jobs: globalJobs } = useGlobalState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [showTasksManagerDialog, setShowTasksManagerDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    id: "",
    title: "",
    dueDate: new Date(),
    priority: "medium",
    status: "scheduled",
    client: { name: "" },
    description: "",
  });
  const [newReminder, setNewReminder] = useState<Partial<Task>>({
    id: "",
    title: "",
    dueDate: new Date(),
    status: "scheduled",
    client: { name: "" },
    description: "",
    isReminder: true
  });

  // Sync with global jobs
  useEffect(() => {
    setJobs(globalJobs as Job[]);
  }, [globalJobs]);

  // Update filtered items based on view mode and selected date
  useEffect(() => {
    let relevantJobs: Job[] = [];
    let relevantTasks: Task[] = [];

    if (viewMode === "day") {
      // Filter for the selected day only
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return isSameDay(jobDate, selectedDate);
      });
      
      relevantTasks = tasks.filter(task => isSameDay(task.dueDate, selectedDate));
    } 
    else if (viewMode === "week") {
      // Filter for the selected week
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return jobDate >= weekStart && jobDate <= weekEnd;
      });
      
      relevantTasks = tasks.filter(task => {
        const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
    } 
    else if (viewMode === "month") {
      // Filter for the selected month
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return jobDate >= monthStart && jobDate <= monthEnd;
      });
      
      relevantTasks = tasks.filter(task => {
        const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });
    }
    
    setJobsForSelectedDate(relevantJobs);
    setTasksForSelectedDate(relevantTasks);
  }, [jobs, tasks, selectedDate, viewMode]);

  const handleAddTask = () => {
    const taskDueDate = newTask.dueDate || new Date();
    const isoString = taskDueDate instanceof Date ? taskDueDate.toISOString() : taskDueDate;
    
    const task: Task = {
      id: uuid(),
      title: newTask.title || "New Task",
      dueDate: newTask.dueDate || new Date(),
      priority: newTask.priority as "high" | "medium" | "low" | "urgent",
      status: newTask.status || "scheduled",
      client: { name: newTask.client?.name || "No Client" },
      description: newTask.description || "",
      start: isoString,
      end: isoString
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
    setShowAddTaskDialog(false);
    setNewTask({
      id: "",
      title: "",
      dueDate: new Date(),
      priority: "medium",
      status: "scheduled",
      client: { name: "" },
      description: "",
    });
    toast.success("Task added successfully");
  };

  const handleAddReminder = () => {
    const reminderDueDate = newReminder.dueDate || new Date();
    const isoString = reminderDueDate instanceof Date ? reminderDueDate.toISOString() : reminderDueDate;
    
    const reminder: Task = {
      id: uuid(),
      title: newReminder.title || "New Reminder",
      dueDate: newReminder.dueDate || new Date(),
      status: newReminder.status || "scheduled",
      client: { name: newReminder.client?.name || "No Client" },
      description: newReminder.description || "",
      start: isoString,
      end: isoString,
      isReminder: true
    };
    
    setTasks(prevTasks => [...prevTasks, reminder]);
    setShowAddReminderDialog(false);
    setNewReminder({
      id: "",
      title: "",
      dueDate: new Date(),
      status: "scheduled",
      client: { name: "" },
      description: "",
      isReminder: true
    });
    toast.success("Reminder added successfully");
  };

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(prevTasks => {
      // Update only the tasks from the selected date
      const tasksForOtherDates = prevTasks.filter(task => 
        !isSameDay(task.dueDate, selectedDate)
      );
      return [...tasksForOtherDates, ...updatedTasks];
    });
    toast.success("Tasks updated successfully");
  };

  const handleViewAllTasks = () => {
    setShowTasksManagerDialog(true);
  };

  // Update selected date and items
  const updateSelectedDateItems = (date: Date) => {
    setSelectedDate(date);
  };

  // Group tasks by status for the selected date
  const overdueCount = tasksForSelectedDate.filter(t => t.status === 'overdue').length;
  const scheduledCount = tasksForSelectedDate.filter(t => t.status === 'scheduled').length;
  const inProgressCount = tasksForSelectedDate.filter(t => t.status === 'in progress').length;
  const completedCount = tasksForSelectedDate.filter(t => t.status === 'completed').length;
  const reminderCount = tasksForSelectedDate.filter(t => t.isReminder).length;
  const jobsCount = jobsForSelectedDate.length;
  const tasksCount = tasksForSelectedDate.filter(t => !t.isReminder).length;

  // Format the selected date for display
  const formattedDate = format(selectedDate, "MMMM d, yyyy");
  const isSelectedDateToday = isToday(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Schedule</h1>
          <p className="text-muted-foreground text-sm">
            Manage your appointments, tasks, and reminders in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setShowAddReminderDialog(true)}
            size="sm"
          >
            <Bell className="h-4 w-4" />
            Add Reminder
          </Button>
          <Button 
            className="gap-1"
            size="sm"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div>
        <CalendarViewOptions 
          currentView={viewMode} 
          onViewChange={setViewMode} 
          selectedDate={selectedDate}
          onViewAllTasks={handleViewAllTasks}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calendar Column */}
        <div className="md:col-span-2">
          <CalendarView
            jobs={jobs}
            tasks={tasks}
            selectedDate={selectedDate}
            jobsForSelectedDate={jobsForSelectedDate}
            tasksForSelectedDate={tasksForSelectedDate}
            updateSelectedDateItems={updateSelectedDateItems}
            viewMode={viewMode}
          />
        </div>

        {/* Unified Card for Jobs and Tasks */}
        <div className="space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Schedule Overview</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isSelectedDateToday ? "Today" : formattedDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {jobsCount} Jobs
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    {tasksCount} Tasks
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Jobs Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <h3 className="text-md font-medium">Jobs</h3>
                </div>
                
                {jobsForSelectedDate.length > 0 ? (
                  <div className="space-y-3">
                    {jobsForSelectedDate.map(job => (
                      <div key={job.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-blue-900">{job.title || job.description || "Untitled Job"}</h4>
                          <Badge variant="outline" className="bg-white">
                            {job.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-blue-700">
                          {job.clientName || "No client"}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-blue-600">
                          <div>${job.amount}</div>
                          <div>{job.time || "No time specified"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>No jobs scheduled for this day</p>
                  </div>
                )}
              </div>

              {/* Tasks Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-5 w-5 text-amber-600" />
                  <h3 className="text-md font-medium">Tasks</h3>
                </div>
                
                {tasksForSelectedDate.filter(task => !task.isReminder).length > 0 ? (
                  <div className="space-y-3">
                    {tasksForSelectedDate
                      .filter(task => !task.isReminder)
                      .map(task => (
                        <div 
                          key={task.id} 
                          className={cn(
                            "p-3 rounded-lg border",
                            task.priority === "urgent" ? "bg-red-50 border-red-200" :
                            task.priority === "high" ? "bg-amber-50 border-amber-200" :
                            task.priority === "medium" ? "bg-yellow-50 border-yellow-200" :
                            "bg-green-50 border-green-200"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant={
                              task.status === "completed" ? "outline" :
                              task.status === "overdue" ? "destructive" :
                              task.status === "in progress" ? "secondary" : 
                              "default"
                            }>
                              {task.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {task.client?.name || "No client"}
                          </div>
                          {task.description && (
                            <p className="mt-1 text-xs text-gray-500">{task.description}</p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>No tasks for this day</p>
                  </div>
                )}
              </div>
              
              {/* Reminders Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <h3 className="text-md font-medium">Reminders</h3>
                  {reminderCount > 0 && (
                    <Badge className="bg-purple-100 text-purple-800 ml-2">
                      {reminderCount}
                    </Badge>
                  )}
                </div>
                
                {tasksForSelectedDate.filter(task => task.isReminder).length > 0 ? (
                  <div className="space-y-3">
                    {tasksForSelectedDate
                      .filter(task => task.isReminder)
                      .map(reminder => (
                        <div key={reminder.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-purple-900">{reminder.title}</h4>
                            <Badge variant="outline" className="bg-white">
                              {new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                          </div>
                          {reminder.description && (
                            <p className="mt-1 text-sm text-purple-700">{reminder.description}</p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p>No reminders for this day</p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-100"
                  onClick={() => setShowAddReminderDialog(true)}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-client" className="text-sm font-medium">
                Client Name
              </label>
              <Input
                id="task-client"
                value={newTask.client?.name}
                onChange={e => setNewTask({ ...newTask, client: { name: e.target.value } })}
                placeholder="Enter client name"
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => 
                    setNewTask({ 
                      ...newTask, 
                      priority: value as "high" | "medium" | "low" | "urgent" 
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-date" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="task-date"
                type="datetime-local"
                value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : ''}
                onChange={e => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task details"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)} size="sm">Cancel</Button>
            <Button onClick={handleAddTask} size="sm">Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Dialog */}
      <Dialog open={showAddReminderDialog} onOpenChange={setShowAddReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <label htmlFor="reminder-title" className="text-sm font-medium">
                Reminder Title
              </label>
              <Input
                id="reminder-title"
                value={newReminder.title}
                onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="Enter reminder title"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-client" className="text-sm font-medium">
                Client Name (Optional)
              </label>
              <Input
                id="reminder-client"
                value={newReminder.client?.name}
                onChange={e => setNewReminder({ ...newReminder, client: { name: e.target.value } })}
                placeholder="Enter client name"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-date" className="text-sm font-medium">
                Reminder Date & Time
              </label>
              <Input
                id="reminder-date"
                type="datetime-local"
                value={newReminder.dueDate ? new Date(newReminder.dueDate).toISOString().slice(0, 16) : ''}
                onChange={e => setNewReminder({ ...newReminder, dueDate: new Date(e.target.value) })}
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="reminder-description"
                value={newReminder.description}
                onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                placeholder="Enter reminder details"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddReminderDialog(false)} size="sm">Cancel</Button>
            <Button onClick={handleAddReminder} size="sm">Add Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tasks Manager Dialog */}
      <Dialog 
        open={showTasksManagerDialog} 
        onOpenChange={setShowTasksManagerDialog}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Tasks & Reminders Manager</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-2">
            <TasksView
              selectedDate={selectedDate}
              tasksForSelectedDate={tasks} // Show all tasks, not just for selected date
              onPreviousDay={() => {}}
              onNextDay={() => {}}
              onTasksChange={handleTasksChange}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowTasksManagerDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
