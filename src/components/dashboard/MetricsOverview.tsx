
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface MetricsOverviewProps {
  financialMetrics: {
    totalRevenue: number;
    totalJobs: number;
    avgJobValue: number;
    totalLeads: number;
    conversionRate: number;
    monthlyGrowth: number;
    monthlyData: Array<{
      name: string;
      value: number;
    }>;
  };
  formatCurrency: (value: number) => string;
  detailedTasksData?: any[];
  detailedRevenueData?: any[];
  detailedBusinessMetrics?: any[];
  dateRange?: DateRange | undefined;
}

const MetricsOverview = ({ 
  financialMetrics, 
  formatCurrency,
  detailedTasksData,
  detailedRevenueData,
  detailedBusinessMetrics,
  dateRange
}: MetricsOverviewProps) => {
  const formatDateRange = () => {
    if (!dateRange?.from) return "All Time";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Monthly Performance
          {dateRange?.from && (
            <span className="text-xs font-normal text-muted-foreground">
              {formatDateRange()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialMetrics.monthlyData}>
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: any) => [`${formatCurrency(value)}`, 'Revenue']}
                cursor={{ fill: 'rgba(239, 246, 255, 0.6)' }}
              />
              <Bar
                dataKey="value"
                fill="rgba(37, 99, 235, 0.9)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsOverview;
