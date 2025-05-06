
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, BarChart3, ChevronRight } from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { format } from "date-fns";

type PerformanceCardProps = {
  leadSources: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  jobTypePerformance: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  financialMetrics: {
    totalRevenue: number;
    companysCut: number;
    [key: string]: any;
  };
  formatCurrency: (amount: number) => string;
  openDetailDialog: (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => void;
  detailedBusinessMetrics: any[];
};

const PerformanceCard = ({
  leadSources,
  jobTypePerformance,
  financialMetrics,
  formatCurrency,
  openDetailDialog,
  detailedBusinessMetrics
}: PerformanceCardProps) => {
  const { dateFilter } = useGlobalState();
  
  const getDateRangeText = () => {
    if (!dateFilter?.from) return "All time";
    
    if (!dateFilter.to || dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
      return format(dateFilter.from, "MMM d, yyyy");
    }
    
    return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <div>Performance Metrics</div>
          <div className="text-xs text-muted-foreground">{getDateRangeText()}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-1">Lead Sources</h4>
          <div className="space-y-2">
            {leadSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{source.count}</span>
                  <span className="text-xs text-muted-foreground">
                    ({source.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Job Types</h4>
          <div className="space-y-2">
            {jobTypePerformance.map((job) => (
              <div key={job.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">{job.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatCurrency(job.revenue)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({job.count} jobs)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Financial KPIs</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Avg. Job Value</span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(financialMetrics.avgJobValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <span className="text-sm">Conversion Rate</span>
              </div>
              <span className="text-sm font-medium">{financialMetrics.conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm">Profit Margin</span>
              </div>
              <span className="text-sm font-medium">{financialMetrics.profitMargin}%</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => openDetailDialog('metrics', 'Business Metrics', detailedBusinessMetrics)}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors group mt-2"
        >
          <span>View detailed metrics</span>
          <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
