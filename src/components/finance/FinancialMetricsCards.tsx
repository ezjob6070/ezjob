
import { Card, CardContent } from "@/components/ui/card";
import { FinancialReport } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useWindowSize } from "@/hooks/use-window-size";
import { Banknote, Wallet, PiggyBank } from "lucide-react";

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
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(report.totalRevenue)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              {report.transactions.filter(t => t.category === "payment" && t.status === "completed").length} completed payments
            </p>
            <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
              <Banknote size={12} className="mr-1" />
              <span>+8.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Company Profit</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(report.companyProfit)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              {profitMargin.toFixed(1)}% margin
            </p>
            <div className="flex items-center bg-emerald-100 text-emerald-600 text-xs font-medium p-1 rounded">
              <PiggyBank size={12} className="mr-1" />
              <span>+6.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Expenses</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(report.totalExpenses + report.technicianPayments)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(report.technicianPayments)} to technicians
            </p>
            <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
              <Wallet size={12} className="mr-1" />
              <span>+4.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialMetricsCards;
