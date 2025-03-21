
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Briefcase, BanIcon, DollarSign, PiggyBank, ArrowDown, ArrowUp } from "lucide-react";

interface TechnicianMetricsCardProps {
  technician: Technician;
  dateRangeText: string;
}

const TechnicianMetricsCard = ({ technician, dateRangeText }: TechnicianMetricsCardProps) => {
  // Calculate technician earnings based on payment type
  const technicianEarnings = technician.paymentType === "percentage" 
    ? technician.totalRevenue * (technician.paymentRate / 100)
    : technician.completedJobs * technician.paymentRate;
  
  // Calculate company profit (assuming 33% goes to expenses)
  const expenses = technician.totalRevenue * 0.33;
  const companyProfit = technician.totalRevenue - technicianEarnings - expenses;
  
  // Calculate profit margin
  const profitMargin = technician.totalRevenue > 0 
    ? (companyProfit / technician.totalRevenue * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{technician.name}'s Performance</h3>
          <p className="text-sm text-muted-foreground">{dateRangeText}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-blue-100 rounded-full">
                <Briefcase className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Completed Jobs</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Successfully finished services</p>
            <p className="text-lg font-bold">{technician.completedJobs}</p>
          </CardContent>
        </Card>

        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-red-100 rounded-full">
                <BanIcon className="h-3.5 w-3.5 text-red-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Cancelled Jobs</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Jobs that didn't complete</p>
            <p className="text-lg font-bold">{technician.cancelledJobs}</p>
          </CardContent>
        </Card>

        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-blue-100 rounded-full">
                <DollarSign className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Total Income</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Revenue from all jobs</p>
            <p className="text-lg font-bold text-sky-600">{formatCurrency(technician.totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-red-100 rounded-full">
                <ArrowDown className="h-3.5 w-3.5 text-red-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Expenses</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Operational costs</p>
            <p className="text-lg font-bold text-red-600">-{formatCurrency(expenses)}</p>
          </CardContent>
        </Card>

        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-red-100 rounded-full">
                <ArrowDown className="h-3.5 w-3.5 text-red-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Technician Earnings</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Paid to technician</p>
            <p className="text-lg font-bold text-red-600">-{formatCurrency(technicianEarnings)}</p>
          </CardContent>
        </Card>

        <Card className="h-[100px]">
          <CardContent className="pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1 bg-green-100 rounded-full">
                <PiggyBank className="h-3.5 w-3.5 text-green-700" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Company Profit</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Net earnings from services</p>
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(companyProfit)}</p>
            <p className="text-xs text-muted-foreground">{profitMargin}% margin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianMetricsCard;
