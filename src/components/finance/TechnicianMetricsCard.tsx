
import { Card, CardContent } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  Briefcase, 
  BanIcon, 
  DollarSign, 
  PiggyBank, 
  ArrowDown, 
  ArrowUp 
} from "lucide-react";

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
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{technician.name}'s Performance</h3>
          <p className="text-sm text-muted-foreground">{dateRangeText}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Completed Jobs</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{technician.completedJobs}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">Successfully finished services</p>
              <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
                <Briefcase size={12} className="mr-1" />
                <span>+5.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Cancelled Jobs</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">{technician.cancelledJobs}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">Jobs that didn't complete</p>
              <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                <BanIcon size={12} className="mr-1" />
                <span>-2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Total Income</h3>
            <p className="text-2xl font-bold text-sky-600 mt-1">{formatCurrency(technician.totalRevenue)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">Revenue from all jobs</p>
              <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
                <DollarSign size={12} className="mr-1" />
                <span>+7.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Expenses</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">-{formatCurrency(expenses)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">Operational costs</p>
              <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                <ArrowDown size={12} className="mr-1" />
                <span>+4.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Technician Earnings</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">-{formatCurrency(technicianEarnings)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">Paid to technician</p>
              <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                <ArrowDown size={12} className="mr-1" />
                <span>+3.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-[110px]">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Company Profit</h3>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(companyProfit)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">{profitMargin}% margin</p>
              <div className="flex items-center bg-green-100 text-green-600 text-xs font-medium p-1 rounded">
                <PiggyBank size={12} className="mr-1" />
                <span>+6.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianMetricsCard;
