
import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PerformanceCardProps {
  leadSources: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  jobTypePerformance: Array<{
    name: string;
    completed: number;
    total: number;
  }>;
  financialMetrics: {
    totalRevenue: number;
    totalJobs: number;
    avgJobValue: number;
    totalLeads: number;
    conversionRate: number;
    monthlyGrowth: number;
  };
  formatCurrency: (value: number) => string;
  detailedBusinessMetrics?: any[];
  dateRange?: DateRange | undefined;
}

const PerformanceCard = ({ 
  leadSources, 
  jobTypePerformance, 
  financialMetrics,
  formatCurrency,
  detailedBusinessMetrics,
  dateRange
}: PerformanceCardProps) => {
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
          Call Tracking
          {dateRange?.from && (
            <span className="text-xs font-normal text-muted-foreground">
              {formatDateRange()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Lead Sources</h3>
            <div className="space-y-2">
              {leadSources.map((source) => (
                <div key={source.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{source.name}</span>
                    <span className="text-xs text-muted-foreground">{source.count} calls ({source.percentage}%)</span>
                  </div>
                  <Progress value={source.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Conversion Rate by Type</h3>
            <div className="space-y-2">
              {jobTypePerformance.map((performance) => (
                <div key={performance.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{performance.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {performance.completed} of {performance.total} ({Math.round((performance.completed / performance.total) * 100)}%)
                    </span>
                  </div>
                  <Progress value={(performance.completed / performance.total) * 100} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
