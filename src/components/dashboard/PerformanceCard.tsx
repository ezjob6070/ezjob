
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, PercentIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PerformanceCardProps = {
  leadSources: { name: string; value: number }[];
  jobTypePerformance: { name: string; value: number }[];
  financialMetrics: {
    avgJobValue: number;
    monthlyGrowth: number;
    conversionRate: number;
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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Top Performance By Job Source</CardTitle>
        <div className="flex mt-2 space-x-2">
          <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Job Source</Badge>
          <Badge variant="outline" className="rounded-full">Job Type</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Lead Sources</h4>
            {leadSources.length > 0 ? (
              <div className="space-y-3">
                {leadSources.map((source) => (
                  <div key={source.name} className="flex items-center">
                    <div className="w-32 mr-2">
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${source.value}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{source.value}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                No lead source data available
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Job Types</h4>
            {jobTypePerformance.length > 0 ? (
              <div className="space-y-3">
                {jobTypePerformance.map((jobType) => (
                  <div key={jobType.name} className="flex items-center">
                    <div className="w-32 mr-2">
                      <span className="text-sm font-medium">{jobType.name}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${jobType.value}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{jobType.value}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                No job type data available
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Business Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => openDetailDialog('metrics', 'Business Metrics Details', detailedBusinessMetrics)}>
              <span className="text-sm text-muted-foreground">Avg. Job Value</span>
              <span className="text-xl font-bold mt-1">{formatCurrency(financialMetrics.avgJobValue)}</span>
            </div>
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => openDetailDialog('metrics', 'Growth Metrics', detailedBusinessMetrics.filter(m => m.label?.includes('Growth') || false))}>
              <span className="text-sm text-muted-foreground">Monthly Growth</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-bold">{financialMetrics.monthlyGrowth}%</span>
                <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
              </div>
            </div>
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => openDetailDialog('metrics', 'Conversion Metrics', detailedBusinessMetrics.filter(m => m.label?.includes('Conversion') || m.label?.includes('Rate') || false))}>
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-bold">{financialMetrics.conversionRate}%</span>
                <PercentIcon className="h-4 w-4 text-blue-500 ml-1" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            className="text-blue-500"
            onClick={() => openDetailDialog('metrics', 'All Business Metrics', detailedBusinessMetrics)}
          >
            View All Metrics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
