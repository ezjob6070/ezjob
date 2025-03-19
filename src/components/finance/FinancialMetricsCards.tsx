
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
      <Card className="h-full">
        <CardContent className="pt-4 pb-3 flex flex-col h-full">
          <div>
            <p className="text-xl font-semibold text-gray-900">Total Income</p>
            <p className="text-sm text-muted-foreground mb-2">All completed transactions</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{formatCurrency(report.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {report.transactions.filter(t => t.category === "payment" && t.status === "completed").length} completed payments
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardContent className="pt-4 pb-3 flex flex-col h-full">
          <div>
            <p className="text-xl font-semibold text-gray-900">Company Profit</p>
            <p className="text-sm text-muted-foreground mb-2">Net earnings after expenses</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">{formatCurrency(report.companyProfit)}</p>
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${profitMargin > 30 ? "text-green-500" : "text-amber-500"}`}>
                {profitMargin.toFixed(1)}% margin
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardContent className="pt-4 pb-3 flex flex-col h-full">
          <div>
            <p className="text-xl font-semibold text-gray-900">Expenses</p>
            <p className="text-sm text-muted-foreground mb-2">Total costs and payments</p>
            <p className="text-2xl md:text-3xl font-bold text-red-600">{formatCurrency(report.totalExpenses + report.technicianPayments)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(report.technicianPayments)} to technicians
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
