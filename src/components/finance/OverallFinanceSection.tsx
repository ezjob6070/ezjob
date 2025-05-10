
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { BadgeDollarSign, ChartBar, PhoneCall, Banknote, TrendingUp } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverallFinanceSectionProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const OverallFinanceSection: React.FC<OverallFinanceSectionProps> = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
  date,
  setDate
}) => {
  // Calculate profit margin for trend display
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const avgJobValue = totalRevenue > 0 ? totalRevenue / 42 : 0;
  
  // Format date range for display in description
  const getDateRangeDisplay = () => {
    if (!date?.from) return "All time";
    
    const from = date.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = date.to ? date.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : from;
    
    return `${from} - ${to}`;
  };

  // Mock data for call stats
  const callsData = {
    total: 154,
    converted: 98,
    followUps: 37,
    conversionRate: 63
  };

  // Mock data for labor costs
  const laborCosts = totalExpenses * 0.6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Revenue Card - Professional Metric Style */}
        <Card className="overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <BadgeDollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                78% of goal
              </span>
            </div>
            
            <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <span>Average per job</span>
                <span className="font-medium text-gray-700">{formatCurrency(avgJobValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Period</span>
                <span className="font-medium text-gray-700">{getDateRangeDisplay()}</span>
              </div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit Card - Professional Metric Style */}
        <Card className="overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <ChartBar className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(totalProfit)}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
                {profitMargin.toFixed(0)}% margin
              </span>
            </div>
            
            <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <span>Labor costs</span>
                <span className="font-medium text-gray-700">{formatCurrency(laborCosts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Materials</span>
                <span className="font-medium text-gray-700">{formatCurrency(totalExpenses - laborCosts)}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-0.5">
                <div className="bg-green-500 h-1 rounded-l"></div>
                <div className="bg-green-300 h-1"></div>
                <div className="bg-green-100 h-1 rounded-r"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Calls Card - Professional Metric Style */}
        <Card className="overflow-hidden shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-full">
                    <PhoneCall className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Total Calls</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{callsData.total}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                {callsData.conversionRate}% conversion
              </span>
            </div>
            
            <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center">
                <span>Converted to jobs</span>
                <span className="font-medium text-gray-700">{callsData.converted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Follow-ups scheduled</span>
                <span className="font-medium text-gray-700">{callsData.followUps}</span>
              </div>
              <div className="mt-2 flex gap-0.5">
                <div 
                  className="bg-purple-500 h-1 rounded-l" 
                  style={{ width: `${callsData.converted / callsData.total * 100}%` }}
                ></div>
                <div 
                  className="bg-purple-300 h-1 rounded-r"
                  style={{ width: `${(callsData.total - callsData.converted) / callsData.total * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallFinanceSection;
