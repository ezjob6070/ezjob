import { DateRange } from "react-day-picker";

export const dashboardTaskCounts = {
  joby: 0,
  inProgress: 0,
  completed: 0,
  canceled: 0,
  rescheduled: 0,
};

export const dashboardFinancialMetrics = {
  totalRevenue: 0,
  companysCut: 0,
  avgJobValue: 0,
  monthlyGrowth: 0,
  conversionRate: 0,
};

export const dashboardLeadSources: { name: string; value: number; percentage: number }[] = [];
export const dashboardJobTypePerformance: any[] = [];
export const dashboardTopTechnicians: any[] = [];
export const dashboardActivities: any[] = [];
export const dashboardEvents: any[] = [];

export const jobsByStatus = {
  scheduled: [] as any[],
  inProgress: [] as any[],
  completed: [] as any[],
  canceled: [] as any[],
  rescheduled: [] as any[],
};

export const detailedTasksData: any[] = [];
export const detailedLeadsData: any[] = [];
export const detailedRevenueData: any[] = [];
export const detailedClientsData: any[] = [];
export const detailedBusinessMetrics: any[] = [];

export const filterByDateRange = <T extends { date?: Date | string }>(
  items: T[],
  _range?: DateRange
): T[] => items;
