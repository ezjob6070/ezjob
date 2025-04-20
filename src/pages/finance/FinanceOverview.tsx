
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions, getDateRangeForTimeFrame } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const FinanceOverview = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const { jobs, jobSources } = useGlobalState();
  
  // Calculate total metrics from actual job data
  const totalRevenue = jobs
    .filter(job => job.status === "completed" && (!date?.from || (job.scheduledDate && new Date(job.scheduledDate) >= date.from)) && (!date?.to || (job.scheduledDate && new Date(job.scheduledDate) <= date.to)))
    .reduce((sum, job) => sum + (job.actualAmount || job.amount || 0), 0);

  // Estimate expenses as 40% of revenue for completed jobs
  const totalExpenses = totalRevenue * 0.4;
  
  // Calculate profit as revenue minus expenses
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/finance">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Finance Overview</h2>
          </div>
          <p className="text-muted-foreground">
            Review your overall financial performance.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <DateRangeSelector date={date} setDate={setDate} />
        </div>
      </div>

      {/* Overall Finance Section */}
      <OverallFinanceSection 
        totalRevenue={totalRevenue} 
        totalExpenses={totalExpenses} 
        totalProfit={totalProfit}
        date={date}
        setDate={setDate}
      />
    </div>
  );
};

export default FinanceOverview;
