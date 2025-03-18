
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DollarSignIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number;
  iconColor: string;
  bgColor: string;
  textColor: string;
  isNegative?: boolean;
  dateRangeText?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  iconColor,
  bgColor,
  textColor,
  isNegative = false,
  dateRangeText
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 ${bgColor} rounded-full`}>
            <DollarSignIcon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>
              {isNegative && "-"}{formatCurrency(value)}
            </p>
            {dateRangeText && (
              <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
      <MetricsCard
        title="Total Revenue"
        value={totalRevenue}
        iconColor="text-blue-700"
        bgColor="bg-blue-100"
        textColor="text-blue-600"
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Technician Earnings"
        value={totalEarnings}
        iconColor="text-red-700"
        bgColor="bg-red-100"
        textColor="text-red-600"
        isNegative={true}
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Company Profit"
        value={companyProfit}
        iconColor="text-green-700"
        bgColor="bg-green-100"
        textColor="text-green-600"
        dateRangeText={dateRangeText}
      />
    </div>
  );
};

export default DashboardMetrics;
