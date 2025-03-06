
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Clock3Icon, 
  CheckIcon, 
  ArrowLeftIcon,
  UserIcon,
  BuildingIcon,
  PenSquareIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "todo" | "in-progress" | "completed";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  client?: {
    name: string;
    id: string;
  };
};

// Mock tasks data (same as in Tasks.tsx)
const tasks = [
  {
    id: "1",
    title: "Follow up on proposal",
    description: "Send updated pricing and timeline for the project",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: "high" as const,
    status: "todo" as const,
    assignee: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "John Doe",
      id: "1",
    },
  },
  {
    id: "2",
    title: "Schedule quarterly review",
    description: "Discuss Q2 performance and future goals",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: "medium" as const,
    status: "todo" as const,
    assignee: {
      name: "Sarah Miller",
      initials: "SM",
    },
    client: {
      name: "Jane Smith",
      id: "2",
    },
  },
  {
    id: "3",
    title: "Update client information",
    description: "Update contact information and company details",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    priority: "low" as const,
    status: "in-progress" as const,
    assignee: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "Bob Johnson",
      id: "3",
    },
  },
  {
    id: "4",
    title: "Send invoice",
    description: "Generate and send monthly invoice",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: "high" as const,
    status: "todo" as const,
    assignee: {
      name: "Sarah Miller",
      initials: "SM",
    },
    client: {
      name: "Alice Brown",
      id: "4",
    },
  },
  {
    id: "5",
    title: "Prepare presentation",
    description: "Create slides for next week's client meeting",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: "medium" as const,
    status: "completed" as const,
    assignee: {
      name: "Alex Johnson",
      initials: "AJ",
    },
    client: {
      name: "Charlie Wilson",
      id: "5",
    },
  },
];

const priorityColors = {
  low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  high: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusIcons = {
  "todo": null,
  "in-progress": <Clock3Icon className="h-3 w-3" />,
  "completed": <CheckIcon className="h-3 w-3" />,
};

const statusColors = {
  "todo": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "completed": "bg-green-100 text-green-800 hover:bg-green-200",
};

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setCompleted(foundTask.status === "completed");
    }
  }, [id]);

  if (!task) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Task not found</h2>
          <p className="text-muted-foreground mt-2">
            The task you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/tasks")}
            className="mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue = task.dueDate < new Date() && task.status !== "completed";

  const handleStatusChange = (checked: boolean) => {
    setCompleted(checked);
    // In a real app, you would update the task status in the backend
    console.log(`Task ${task.id} status changed to ${checked ? "completed" : "todo"}`);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/tasks")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Task Details
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage task information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={completed}
                onCheckedChange={(checked) => handleStatusChange(checked as boolean)}
                className="h-5 w-5"
              />
              <div>
                <CardTitle className={`text-xl ${completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge
                variant="outline"
                className={statusColors[task.status]}
              >
                <div className="flex items-center gap-1">
                  {statusIcons[task.status]}
                  <span>
                    {task.status.split("-").map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(" ")}
                  </span>
                </div>
              </Badge>
              <Button size="sm" variant="ghost">
                <PenSquareIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
              
              {task.client && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <BuildingIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    Client
                  </h3>
                  <div className="flex items-center">
                    <a 
                      href={`/clients/${task.client.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {task.client.name}
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Due Date
                </h3>
                <p className={`text-sm ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                  {format(task.dueDate, "MMMM d, yyyy")}
                  {isOverdue && " (Overdue)"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Assigned To
                </h3>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback>
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
