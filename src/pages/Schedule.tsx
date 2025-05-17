import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { 
  isSameDay, format, isToday, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, addDays
} from "date-fns";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Bell, 
  Calendar as CalendarIcon
} from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import CalendarView from "@/components/schedule/CalendarView";
import TasksView from "@/components/schedule/TasksView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  const [activeTab, setActiveTab] = useState<string>("calendar"); // "calendar", "tasks", "reminders"
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

  // Update selected date and items
  const updateSelectedDateItems = (date: Date) => {
    setSelectedDate(date);
  };

  // Navigation for days
  const goToPreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  // Count summaries for selected date
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
          <h1 className="text-2xl font-medium tracking-tight mb-1">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            {isSelectedDateToday ? "Today's Schedule" : formattedDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-1 border-gray-200"
            onClick={() => setShowAddReminderDialog(true)}
            size="sm"
          >
            <Bell className="h-4 w-4" />
            Reminder
          </Button>
          <Button 
            className="gap-1"
            size="sm"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Task
          </Button>
        </div>
      </div>

      <Separator />

      {/* Top Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
            <TabsTrigger 
              value="calendar" 
              className="rounded-md py-2 px-4 data-[state=active]:bg-background border border-gray-200 
              data-[state=active]:border-gray-300 data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className="rounded-md py-2 px-4 data-[state=active]:bg-background border border-gray-200 
              data-[state=active]:border-gray-300 data-[state=active]:shadow-sm"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="reminders"
              className="rounded-md py-2 px-4 data-[state=active]:bg-background border border-gray-200 
              data-[state=active]:border-gray-300 data-[state=active]:shadow-sm"
            >
              Reminders
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {/* Calendar view */}
          <TabsContent value="calendar" className="m-0">
            <CalendarView
              jobs={jobs}
              tasks={tasks}
              selectedDate={selectedDate}
              jobsForSelectedDate={jobsForSelectedDate}
              tasksForSelectedDate={tasksForSelectedDate}
              updateSelectedDateItems={updateSelectedDateItems}
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
          </TabsContent>

          {/* Tasks view */}
          <TabsContent value="tasks" className="m-0">
            <TasksView
              selectedDate={selectedDate}
              tasksForSelectedDate={tasksForSelectedDate.filter(task => !task.isReminder)}
              onPreviousDay={goToPreviousDay}
              onNextDay={goToNextDay}
              onTasksChange={(updatedTasks) => {
                // Update only the non-reminder tasks while preserving reminders
                const reminders = tasks.filter(task => task.isReminder);
                setTasks([...updatedTasks, ...reminders]);
              }}
            />
          </TabsContent>

          {/* Reminders view */}
          <TabsContent value="reminders" className="m-0">
            <TasksView
              selectedDate={selectedDate}
              tasksForSelectedDate={tasksForSelectedDate.filter(task => task.isReminder)}
              onPreviousDay={goToPreviousDay}
              onNextDay={goToNextDay}
              onTasksChange={(updatedTasks) => {
                // Update only the reminder tasks while preserving non-reminders
                const nonReminders = tasks.filter(task => !task.isReminder);
                setTasks([...nonReminders, ...updatedTasks]);
              }}
            />
          </TabsContent>
        </div>
      </Tabs>

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
    </div>
  );
};

export default Schedule;
