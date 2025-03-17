
export const JOB_CATEGORIES = [
  "All Categories",
  "Plumbing",
  "HVAC",
  "Electrical",
  "General Maintenance",
];

export interface DateFilter {
  label: string;
  value: string;
}

export const DATE_FILTERS: DateFilter[] = [
  { label: "Today", value: "today" },
  { label: "All Dates", value: "all" },
  { label: "This Week", value: "this_week" },
  { label: "Next Week", value: "next_week" },
  { label: "This Month", value: "this_month" },
  { label: "Next Month", value: "next_month" },
];
