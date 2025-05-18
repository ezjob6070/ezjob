
export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
}

// Event types
export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection" | "reminder";
}

// Add missing job type definitions that are referenced in error messages
export type Job = {
  id: string;
  date: string;
  scheduledDate?: string;
  technicianId: string;
  status: string;
  amount: number;
  actualAmount?: number;
  // Add any other fields that might be needed
};

// Add sort option type that is referenced
export type SortOption = string;
export type DateFilterType = string;
export type RangeValue = {
  from?: Date;
  to?: Date;
};

// Add DateRange props for components
export interface DateFilterTabsProps {
  selectedFilter?: DateFilterType;
  onFilterChange?: (filter: DateFilterType) => void;
  customDateRange?: { from: Date; to: Date };
  onCustomDateChange?: (range: any) => void;
  value?: string; // Added to fix TS error
}

// Add JobSourceFilterProps
export interface JobSourceFilterProps {
  value?: string;
  onChange?: (value: any) => void;
  jobSources?: { id: string; name: string; }[];
}
