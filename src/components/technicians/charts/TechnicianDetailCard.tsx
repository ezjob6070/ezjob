
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  Briefcase, 
  BanIcon, 
  DollarSign, 
  ArrowDown, 
  ArrowUp, 
  WrenchIcon,
  Settings
} from "lucide-react";
import { Technician } from "@/types/technician";

export interface TechnicianMetrics {
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  revenue?: number;
  earnings?: number;
  expenses?: number;
  profit?: number;
  partsValue?: number;
}

export interface TechnicianDetailCardProps {
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
              <p className="text-sm font-medium text-black">Completed Jobs</p>
              <p className="text-2xl font-bold">{metrics.completedJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <BanIcon className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">Cancelled Jobs</p>
              <p className="text-2xl font-bold">{metrics.cancelledJobs}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-black">Total Revenue</p>
              <p className="text-2xl font-bold text-sky-600">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <ArrowDown className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-black">Technician Earnings</p>
              <p className="text-2xl font-bold text-red-600">-{formatCurrency(metrics.earnings || 0)}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-black mb-2">Financial Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <ArrowUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Revenue</p>
                <p className="text-xl font-semibold text-sky-600">{metrics.revenue ? formatCurrency(metrics.revenue) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <ArrowDown className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Expenses</p>
                <p className="text-xl font-semibold text-red-600">-{metrics.expenses ? formatCurrency(metrics.expenses) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100">
                <WrenchIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Parts Value</p>
                <p className="text-xl font-semibold text-orange-600">-{metrics.partsValue ? formatCurrency(metrics.partsValue) : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <Settings className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-black">Company Profit</p>
                <p className="text-xl font-semibold text-emerald-600">{metrics.profit ? formatCurrency(metrics.profit) : 'N/A'}</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-black">Profit Margin</p>
              <p className="text-xl font-semibold">{profitMargin}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianDetailCard;
