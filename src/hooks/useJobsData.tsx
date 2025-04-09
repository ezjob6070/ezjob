
// This file now serves as a barrel export for job-related hooks
import { useJobsData } from "./jobs/useJobsData";
import { useJobSources } from "./jobs/useJobSources";

// Export the type separately to avoid import errors
export type { SortOption } from "./technicians/useTechnicianTableSorting";

export { useJobsData, useJobSources };
