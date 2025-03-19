
import { DollarSignIcon, PiggyBankIcon, TrendingDownIcon, ArrowUpIcon, ArrowLeftRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialReport } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface FinancialMetricsCardsProps {
  report: FinancialReport;
}

const FinancialMetricsCards = ({ report }: FinancialMetricsCardsProps) => {
  const profitMargin = report.totalRevenue > 0 
    ? (report.companyProfit / report.totalRevenue) * 100 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSignIcon className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">Total Revenue</p>
              <p className="text-2xl font-bold text-sky-600">{formatCurrency(report.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {report.transactions.filter(t => t.category === "payment" && t.status === "completed").length} completed payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <PiggyBankIcon className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">Company Profit</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(report.companyProfit)}</p>
              <div className="flex items-center">
                <span className={`text-xs font-medium flex items-center mt-1 ${profitMargin > 30 ? "text-green-500" : "text-amber-500"}`}>
                  {profitMargin > 30 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowLeftRightIcon className="h-3 w-3 mr-1" />}
                  {profitMargin.toFixed(1)}% margin
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDownIcon className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(report.totalExpenses + report.technicianPayments)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(report.technicianPayments)} to technicians
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
