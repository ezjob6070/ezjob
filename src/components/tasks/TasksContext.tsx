
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ProjectTask } from "@/types/project";
import { toast } from "sonner";

// Sample data
const initialTasks: ProjectTask[] = [
  {
    id: "task-1",
    title: "Site preparation",
    description: "Clear the site and prepare for foundation work",
    status: "completed",
    priority: "high",
    dueDate: "2024-05-25",
    assignedTo: "John Carpenter",
    createdAt: "2024-05-10",
    progress: 100,
    attachments: [
      { id: "att1", name: "Site plan.pdf", type: "pdf", url: "#", uploadedAt: "2024-05-10", uploadedBy: "Sarah Admin" }
    ]
  },
  {
    id: "task-2",
    title: "Foundation construction",
    description: "Pour and set foundation concrete",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2024-05-30",
    assignedTo: "Mike Builder",
    createdAt: "2024-05-12",
    progress: 65,
    attachments: [
      { id: "att2", name: "Foundation_specs.pdf", type: "pdf", url: "#", uploadedAt: "2024-05-12", uploadedBy: "Sarah Admin" }
    ]
  },
  {
    id: "task-3",
    title: "Framing and structural work",
    description: "Complete all framing according to blueprints",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-06-10",
    assignedTo: "Mike Builder",
    createdAt: "2024-05-15",
    progress: 30,
    attachments: []
  },
  {
    id: "task-4",
    title: "Building inspection - initial",
    description: "Schedule and prepare for initial building inspection",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-15",
    assignedTo: "Sarah Admin",
    createdAt: "2024-05-16",
    progress: 0,
    attachments: []
  },
  {
    id: "task-5",
    title: "Electrical rough-in",
    description: "Install electrical wiring and boxes",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-20",
    assignedTo: "Tom Electrician",
    createdAt: "2024-05-17",
    progress: 0,
    attachments: []
  },
  {
    id: "task-6",
    title: "Plumbing rough-in",
    description: "Install water and waste lines",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-25",
    assignedTo: "Gary Plumber",
    createdAt: "2024-05-18",
    progress: 0,
    attachments: []
  },
];

interface TasksContextProps {
  tasks: ProjectTask[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  selectedTask: ProjectTask | null;
  isTaskDialogOpen: boolean;
  isNewTaskDialogOpen: boolean;
  newTask: Partial<ProjectTask>;
  filteredTasks: ProjectTask[];
  overallProgress: number;
  statusCounts: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    blocked: number;
  };
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setPriorityFilter: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<ProjectTask | null>>;
  setIsTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewTaskDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTask: React.Dispatch<React.SetStateAction<Partial<ProjectTask>>>;
  handleAddTask: () => void;
  handleUpdateTask: () => void;
  handleDeleteTask: (taskId: string) => void;
  handleAddDocument: () => void;
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

// Helper functions
const getStatusCounts = (tasks: ProjectTask[]) => {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
    blocked: tasks.filter(t => t.status === "blocked").length,
  };
};

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    progress: 0,
    attachments: []
  });

  // Calculate derived state
  const statusCounts = getStatusCounts(tasks);
  
  // Filter tasks based on search term, status and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (task.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate overall progress
  const overallProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  const handleAddTask = () => {
    const newTaskId = `task-${tasks.length + 1}`;
    const taskToAdd: ProjectTask = {
      ...newTask as ProjectTask,
      id: newTaskId,
      createdAt: new Date().toISOString().split('T')[0],
      attachments: newTask.attachments || []
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      progress: 0,
      attachments: []
    });
    setIsNewTaskDialogOpen(false);
    toast.success("Task added successfully");
  };

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? selectedTask : task
    ));
    
    setIsTaskDialogOpen(false);
    toast.success("Task updated successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsTaskDialogOpen(false);
    toast.success("Task deleted successfully");
  };

  const handleAddDocument = () => {
    if (!selectedTask) return;
    
    // This would be replaced with an actual file upload in a real application
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: "New Document.pdf",
      type: "pdf",
      url: "#",
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: "Current User"
    };
    
    const updatedTask = {
      ...selectedTask,
      attachments: [...(selectedTask.attachments || []), newDocument]
    };
    
    setSelectedTask(updatedTask);
    toast.success("Document added successfully");
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      searchTerm,
      statusFilter,
      priorityFilter,
      selectedTask,
      isTaskDialogOpen,
      isNewTaskDialogOpen,
      newTask,
      filteredTasks,
      overallProgress,
      statusCounts,
      setTasks,
      setSearchTerm,
      setStatusFilter,
      setPriorityFilter,
      setSelectedTask,
      setIsTaskDialogOpen,
      setIsNewTaskDialogOpen,
      setNewTask,
      handleAddTask,
      handleUpdateTask,
      handleDeleteTask,
      handleAddDocument
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
