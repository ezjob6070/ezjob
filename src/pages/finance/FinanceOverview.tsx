
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions, getDateRangeForTimeFrame } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";

const FinanceOverview = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);

  useEffect(() => {
    // Prepare job sources with financial data
    const sources: JobSource[] = [
      {
        id: "js1",
        name: "Website",
        totalJobs: 120,
        totalRevenue: 55000,
        expenses: 12000,
        companyProfit: 23000,
        createdAt: new Date(),
      },
      {
        id: "js2", 
        name: "Referral",
        totalJobs: 80,
        totalRevenue: 40000,
        expenses: 8000,
        companyProfit: 18000,
        createdAt: new Date(),
      },
      {
        id: "js3",
        name: "Google Ads",
        totalJobs: 150,
        totalRevenue: 70000,
        expenses: 25000,
        companyProfit: 30000,
        createdAt: new Date(),
      },
      {
        id: "js4",
        name: "Social Media",
        totalJobs: 65,
        totalRevenue: 32000,
        expenses: 10000,
        companyProfit: 12000,
        createdAt: new Date(),
      },
      {
        id: "js5",
        name: "Direct Call",
        totalJobs: 95,
        totalRevenue: 48000,
        expenses: 9000,
        companyProfit: 22000,
        createdAt: new Date(),
      },
    ] as JobSource[];
    
    setJobSources(sources);
  }, []);

  // Calculate total metrics
  const totalRevenue = jobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = jobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

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
      />
    </div>
  );
};

export default FinanceOverview;
