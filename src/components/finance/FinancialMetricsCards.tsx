
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, PiggyBankIcon, ArrowLeftRightIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(report.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            {report.transactions.filter(t => t.category === "payment" && t.status === "completed").length} completed payments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Company Profit</CardTitle>
          <PiggyBankIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(report.companyProfit)}</div>
          <div className="flex items-center mt-1">
            <span className={`text-xs font-medium flex items-center ${profitMargin > 30 ? "text-green-500" : "text-amber-500"}`}>
              {profitMargin > 30 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowLeftRightIcon className="h-3 w-3 mr-1" />}
              {profitMargin.toFixed(1)}% margin
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(report.totalExpenses + report.technicianPayments)}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(report.technicianPayments)} to technicians
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
