
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface MetricsCardProps {
  title: string;
  value: number;
  iconColor: string;
  dateRangeText?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  iconColor,
  dateRangeText
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div>
          <p className="text-sm font-medium text-black">{title}</p>
          <p className={`text-2xl font-bold ${iconColor}`}>{formatCurrency(value)}</p>
          {dateRangeText && (
            <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
          )}
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
        iconColor="text-sky-600"
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Technician Earnings"
        value={totalEarnings}
        iconColor="text-red-600"
        dateRangeText={dateRangeText}
      />
      
      <MetricsCard
        title="Company Profit"
        value={companyProfit}
        iconColor="text-emerald-600"
        dateRangeText={dateRangeText}
      />
    </div>
  );
};

export default DashboardMetrics;
