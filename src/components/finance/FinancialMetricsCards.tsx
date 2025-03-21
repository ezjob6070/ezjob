
import { Card, CardContent } from "@/components/ui/card";
import { FinancialReport } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useWindowSize } from "@/hooks/use-window-size";

interface FinancialMetricsCardsProps {
  report: FinancialReport;
}

const FinancialMetricsCards = ({ report }: FinancialMetricsCardsProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  const profitMargin = report.totalRevenue > 0 
    ? (report.companyProfit / report.totalRevenue) * 100 
    : 0;

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-full">
      <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200 hover:shadow-md transition-all">
        <CardContent className="p-3 flex flex-col h-full">
          <div>
            <p className="text-sm font-semibold text-gray-900">Total Income</p>
            <p className="text-xs text-muted-foreground mb-0.5">All completed transactions</p>
            <p className="text-base md:text-lg font-bold text-blue-600">{formatCurrency(report.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {report.transactions.filter(t => t.category === "payment" && t.status === "completed").length} completed payments
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all">
        <CardContent className="p-3 flex flex-col h-full">
          <div>
            <p className="text-sm font-semibold text-gray-900">Company Profit</p>
            <p className="text-xs text-muted-foreground mb-0.5">Net earnings after expenses</p>
            <p className="text-base md:text-lg font-bold text-emerald-600">{formatCurrency(report.companyProfit)}</p>
            <div className="flex items-center mt-0.5">
              <span className={`text-xs font-medium ${profitMargin > 30 ? "text-green-500" : "text-amber-500"}`}>
                {profitMargin.toFixed(1)}% margin
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200 hover:shadow-md transition-all">
        <CardContent className="p-3 flex flex-col h-full">
          <div>
            <p className="text-sm font-semibold text-gray-900">Expenses</p>
            <p className="text-xs text-muted-foreground mb-0.5">Total costs and payments</p>
            <p className="text-base md:text-lg font-bold text-red-600">{formatCurrency(report.totalExpenses + report.technicianPayments)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatCurrency(report.technicianPayments)} to technicians
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
