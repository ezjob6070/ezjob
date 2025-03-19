
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{technician.name}'s Performance</h3>
          <p className="text-sm text-muted-foreground">{dateRangeText}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Briefcase className="h-4 w-4 text-blue-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Completed Jobs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technician.completedJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <BanIcon className="h-4 w-4 text-red-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Cancelled Jobs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technician.cancelledJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-4 w-4 text-blue-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Total Revenue</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-600">{formatCurrency(technician.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <ArrowDown className="h-4 w-4 text-red-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Expenses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(expenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-full">
                <ArrowDown className="h-4 w-4 text-red-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Technician Earnings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(technicianEarnings)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <PiggyBank className="h-4 w-4 text-green-700" />
              </div>
              <CardTitle className="text-sm font-medium text-gray-900">Company Profit</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(companyProfit)}</div>
            <p className="text-xs text-muted-foreground mt-1">{profitMargin}% margin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianMetricsCard;
