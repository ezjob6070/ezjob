
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DollarSignIcon, TrendingDownIcon, PiggyBankIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  dateRangeText?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  dateRangeText
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 ${bgColor} rounded-full`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{formatCurrency(value)}</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <MetricsCard
        title="Total Revenue"
        value={totalRevenue}
        icon={<DollarSignIcon className="h-5 w-5 text-blue-700" />}
        bgColor="bg-blue-100"
        iconColor="text-blue-700"
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Technician Earnings"
        value={totalEarnings}
        icon={<TrendingDownIcon className="h-5 w-5 text-red-700" />}
        bgColor="bg-red-100"
        iconColor="text-red-700"
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Company Profit"
        value={companyProfit}
        icon={<PiggyBankIcon className="h-5 w-5 text-green-700" />}
        bgColor="bg-green-100"
        iconColor="text-green-700"
        dateRangeText={dateRangeText}
      />
    </div>
  );
};

export default DashboardMetrics;
