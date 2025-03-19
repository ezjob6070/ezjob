
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface DashboardMetricsProps {
  totalRevenue: number;
  totalEarnings: number;
  companyProfit: number;
  dateRangeText: string;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalRevenue,
  totalEarnings,
  companyProfit,
  dateRangeText
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-lg font-bold">
              $
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Total Revenue from All Technicians
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {dateRangeText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-lg font-bold">
              $
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Technician Earnings from All Technicians
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalEarnings)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {dateRangeText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-lg font-bold">
              $
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Company Profit from All Technicians
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(companyProfit)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {dateRangeText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
