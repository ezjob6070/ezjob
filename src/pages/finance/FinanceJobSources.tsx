
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";

const FinanceJobSources = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);

  useEffect(() => {
    if (date?.from && date?.to) {
      // Filter by date
      let filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= date.from && transactionDate <= date.to;
      });

      setFilteredTransactions(filtered);
    }
  }, [date, transactions]);

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
            <h2 className="text-2xl font-bold tracking-tight">Job Source Finance</h2>
          </div>
          <p className="text-muted-foreground">
            Analyze revenue and expenses by job source.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <DateRangeSelector date={date} setDate={setDate} />
        </div>
      </div>

      {/* Job Source Finance Section */}
      <JobSourceFinanceSection 
        jobSources={jobSources} 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default FinanceJobSources;
