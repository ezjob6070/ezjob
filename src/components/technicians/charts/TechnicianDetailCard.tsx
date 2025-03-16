import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  Star, 
  DollarSign, 
  ArrowDown, 
  ArrowUp, 
  Briefcase, 
  BanIcon, 
  WrenchIcon,
  Settings
} from "lucide-react";
import { Technician } from "@/types/technician";

interface TechnicianMetrics {
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  revenue?: number;
  earnings?: number;
  expenses?: number;
  profit?: number;
  partsValue?: number;
}

interface TechnicianDetailCardProps {
  technician: Technician;
  metrics: TechnicianMetrics;
  dateRangeText?: string;
}

const TechnicianDetailCard: React.FC<TechnicianDetailCardProps> = ({ 
  technician, 
  metrics,
  dateRangeText = ""
}) => {
  const profitMargin = metrics.revenue ? ((metrics.profit || 0) / metrics.revenue * 100).toFixed(1) : '0.0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Performance</CardTitle>
        <CardDescription>
          Key metrics for {technician.name} {dateRangeText ? `(${dateRangeText})` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Briefcase className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
              <p className="text-2xl font-bold">{metrics.completedJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <BanIcon className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cancelled Jobs</p>
              <p className="text-2xl font-bold">{metrics.cancelledJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-100">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold">{metrics.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Financial Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <ArrowUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-xl font-semibold">{metrics.revenue ? formatCurrency(metrics.revenue) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <ArrowDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earnings</p>
                <p className="text-xl font-semibold">-{metrics.earnings ? formatCurrency(metrics.earnings) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100">
                <WrenchIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parts Value</p>
                <p className="text-xl font-semibold">-{metrics.partsValue ? formatCurrency(metrics.partsValue) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-violet-100">
                <Settings className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit</p>
                <p className="text-xl font-semibold">{metrics.profit ? formatCurrency(metrics.profit) : 'N/A'}</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
              <p className="text-xl font-semibold">{profitMargin}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianDetailCard;
