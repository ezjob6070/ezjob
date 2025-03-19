
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

export interface TechnicianPerformanceMetricsProps {
  technician: Technician;
  metrics: {
    revenue?: number;
    earnings?: number;
    expenses?: number;
    profit?: number;
    partsValue?: number;
  };
  jobStatus?: string;
  onJobStatusChange?: (status: string) => void;
}

const TechnicianPerformanceMetrics: React.FC<TechnicianPerformanceMetricsProps> = ({
  technician,
  metrics,
  jobStatus = "all",
  onJobStatusChange
}) => {
  if (!technician || !metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm font-medium text-black">Completed Jobs</p>
            <p className="text-2xl font-bold">{technician.completedJobs || 0}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm font-medium text-black">Rating</p>
            <p className="text-2xl font-bold text-amber-600">{(technician.rating || 0).toFixed(1)}★</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm font-medium text-black">Average Job Value</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.revenue ? metrics.revenue / (technician.completedJobs || 1) : 0)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div>
            <p className="text-sm font-medium text-black">Total Revenue</p>
            <p className="text-2xl font-bold text-sky-600">{formatCurrency(metrics.revenue || 0)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianPerformanceMetrics;
