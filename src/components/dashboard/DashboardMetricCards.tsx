
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface DashboardMetricCardsProps {
  financialMetrics: {
    totalRevenue: number;
    monthlyGrowth: number;
    avgJobValue: number;
  };
  taskCounts: {
    completed: number;
    inProgress: number;
    canceled: number;
    rescheduled: number;
  };
  totalTasks: number;
  dateRange?: string;
}

const DashboardMetricCards: React.FC<DashboardMetricCardsProps> = ({
  financialMetrics,
  taskCounts,
  totalTasks,
  dateRange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
      <Card className="bg-blue-50 shadow-sm border border-blue-100">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-blue-900">Total Revenue</h3>
            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{financialMetrics.monthlyGrowth}%</span>
          </div>
          <div className="text-xl font-bold text-blue-900">${formatCurrency(financialMetrics.totalRevenue)}</div>
          <div className="text-xs text-blue-600 mt-1">
            ${formatCurrency(financialMetrics.avgJobValue)} avg per job • {dateRange || "All time"}
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full mt-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
          </div>
          <div className="text-xs text-blue-600 mt-1">78% of quarterly target</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 shadow-sm border border-green-100">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-green-900">Net Profit</h3>
            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">60% profit margin</span>
          </div>
          <div className="text-xl font-bold text-green-900">${formatCurrency(financialMetrics.totalRevenue * 0.6)}</div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-green-100 rounded p-1 text-center">
              <div className="text-xs text-green-700">$23,800</div>
              <div className="text-[10px] text-green-700">Labor</div>
            </div>
            <div className="bg-green-100 rounded p-1 text-center">
              <div className="text-xs text-green-700">$17,850</div>
              <div className="text-[10px] text-green-700">Materials</div>
            </div>
            <div className="bg-green-100 rounded p-1 text-center">
              <div className="text-xs text-green-700">$17,850</div>
              <div className="text-[10px] text-green-700">Operating</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 shadow-sm border border-purple-100">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-purple-900">Total Jobs</h3>
            <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{totalTasks}</span>
          </div>
          <div className="text-xl font-bold text-purple-900">{totalTasks}</div>
          <div className="text-xs text-purple-600 mt-1">
            {taskCounts.completed} completed, {taskCounts.inProgress} in progress
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-purple-100 rounded p-1 text-center">
              <div className="text-xs text-purple-700">53%</div>
              <div className="text-[10px] text-purple-700">Completion Rate</div>
            </div>
            <div className="bg-purple-100 rounded p-1 text-center">
              <div className="text-xs text-purple-700">{taskCounts.inProgress}</div>
              <div className="text-[10px] text-purple-700">In Progress</div>
            </div>
            <div className="bg-purple-100 rounded p-1 text-center">
              <div className="text-xs text-purple-700">{taskCounts.rescheduled}</div>
              <div className="text-[10px] text-purple-700">Rescheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetricCards;
