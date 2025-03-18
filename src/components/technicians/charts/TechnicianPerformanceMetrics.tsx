
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Technician } from "@/types/technician";

interface TechnicianPerformanceMetricsProps {
  technician: Technician;
  metrics: {
    revenue: number;
    earnings: number;
    expenses: number;
    profit: number;
    partsValue: number;
  } | null;
}

const TechnicianPerformanceMetrics: React.FC<TechnicianPerformanceMetricsProps> = ({
  technician,
  metrics
}) => {
  if (!metrics) return <div>No metrics available</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const MetricItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{typeof value === 'number' ? formatCurrency(value) : value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
            <MetricItem label="Total Revenue" value={metrics.revenue} />
            <MetricItem label="Earnings" value={metrics.earnings} />
            <MetricItem label="Expenses" value={metrics.expenses} />
            <MetricItem label="Net Profit" value={metrics.profit} />
            <MetricItem label="Parts Value" value={metrics.partsValue} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Performance Stats</h3>
            <MetricItem label="Completed Jobs" value={technician.completedJobs || 0} />
            <MetricItem label="Cancelled Jobs" value={technician.cancelledJobs || 0} />
            <MetricItem label="Success Rate" 
              value={`${((technician.completedJobs || 0) / 
                ((technician.completedJobs || 0) + (technician.cancelledJobs || 1)) * 100).toFixed(1)}%`} 
            />
            <MetricItem label="Rating" value={`${technician.rating || 0}/5`} />
            <MetricItem label="Payment Type" 
              value={technician.paymentType === 'percentage' 
                ? `${technician.paymentRate}%` 
                : `$${technician.paymentRate}/hr`} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianPerformanceMetrics;
