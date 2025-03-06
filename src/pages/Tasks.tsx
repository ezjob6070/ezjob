
import { useState } from "react";
import { PlusIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TasksList from "@/components/TasksList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tasks = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    priority: {
      low: true,
      medium: true,
      high: true,
    },
    status: {
      todo: true,
      "in-progress": true,
      completed: true,
    },
  });

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

  const filteredTasks = tasks.filter((task) => {
    const priorityMatch = filters.priority[task.priority];
    const statusMatch = filters.status[task.status];
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "today" &&
        task.dueDate.toDateString() === new Date().toDateString()) ||
      (activeTab === "upcoming" &&
        task.dueDate > new Date() &&
        task.dueDate.toDateString() !== new Date().toDateString()) ||
      (activeTab === "overdue" &&
        task.dueDate < new Date() &&
        task.status !== "completed");

    return priorityMatch && statusMatch && tabMatch;
  });

  const handleFilterChange = (
    filterType: "priority" | "status",
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [value]: checked,
      },
    }));
  };

  const todayTasks = tasks.filter(
    (task) => task.dueDate.toDateString() === new Date().toDateString()
  );
  const upcomingTasks = tasks.filter(
    (task) =>
      task.dueDate > new Date() &&
      task.dueDate.toDateString() !== new Date().toDateString()
  );
  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate < new Date() &&
      task.dueDate.toDateString() !== new Date().toDateString() &&
      task.status !== "completed"
  );

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your tasks
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="today" className="relative">
              Today
              {todayTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {todayTasks.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                  {upcomingTasks.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="relative">
              Overdue
              {overdueTasks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center rounded-full">
                  {overdueTasks.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.priority.low}
              onCheckedChange={(checked) =>
                handleFilterChange("priority", "low", checked)
              }
            >
              Low
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.priority.medium}
              onCheckedChange={(checked) =>
                handleFilterChange("priority", "medium", checked)
              }
            >
              Medium
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.priority.high}
              onCheckedChange={(checked) =>
                handleFilterChange("priority", "high", checked)
              }
            >
              High
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.status.todo}
              onCheckedChange={(checked) =>
                handleFilterChange("status", "todo", checked)
              }
            >
              To Do
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status["in-progress"]}
              onCheckedChange={(checked) =>
                handleFilterChange("status", "in-progress", checked)
              }
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status.completed}
              onCheckedChange={(checked) =>
                handleFilterChange("status", "completed", checked)
              }
            >
              Completed
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TabsContent value="all" className="mt-0">
        <TasksList tasks={filteredTasks} />
      </TabsContent>
      <TabsContent value="today" className="mt-0">
        <TasksList
          tasks={filteredTasks.filter(
            (task) => task.dueDate.toDateString() === new Date().toDateString()
          )}
        />
      </TabsContent>
      <TabsContent value="upcoming" className="mt-0">
        <TasksList
          tasks={filteredTasks.filter(
            (task) =>
              task.dueDate > new Date() &&
              task.dueDate.toDateString() !== new Date().toDateString()
          )}
        />
      </TabsContent>
      <TabsContent value="overdue" className="mt-0">
        <TasksList
          tasks={filteredTasks.filter(
            (task) =>
              task.dueDate < new Date() &&
              task.dueDate.toDateString() !== new Date().toDateString() &&
              task.status !== "completed"
          )}
        />
      </TabsContent>
    </div>
  );
};

export default Tasks;
