
import { Task } from "@/components/calendar/types";

export type TasksFilterType = "all" | "scheduled" | "in progress" | "completed" | "overdue";
export type TasksSortOrder = "newest" | "oldest";
export type TasksViewMode = "all" | "tasks" | "reminders";

export interface TasksViewProps {
  selectedDate: Date;
  tasksForSelectedDate: Task[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onTasksChange?: (tasks: Task[]) => void;
}

export interface TasksHeaderProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

export interface TasksFiltersProps {
  filterType: TasksFilterType;
  setFilterType: (type: TasksFilterType) => void;
  sortOrder: TasksSortOrder;
  setSortOrder: (order: TasksSortOrder) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: TasksViewMode;
  setViewMode: (mode: TasksViewMode) => void;
  tasksCount: number;
  remindersCount: number;
  onCreateReminder?: () => void;
}

export interface TasksListProps {
  filteredTasks: Task[];
  viewMode: TasksViewMode;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}
