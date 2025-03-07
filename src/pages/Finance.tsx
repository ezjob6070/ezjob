
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions, generateFinancialReport, getDateRangeForTimeFrame } from "@/data/finances";
import { initialTechnicians } from "@/data/technicians";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";
import TechnicianFinanceSection from "@/components/finance/TechnicianFinanceSection";
import TransactionsSection from "@/components/finance/TransactionsSection";

const Finance = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));

  useEffect(() => {
    if (date?.from && date?.to) {
      const filtered = transactions.filter(transaction => {
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

  // Calculate total metrics
  const totalRevenue = jobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = jobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>

      {/* Overall Finance Section */}
      <OverallFinanceSection 
        totalRevenue={totalRevenue} 
        totalExpenses={totalExpenses} 
        totalProfit={totalProfit} 
      />

      {/* Job Source Finance Section */}
      <JobSourceFinanceSection 
        jobSources={jobSources} 
        filteredTransactions={filteredTransactions} 
      />

      {/* Technician Finance Section */}
      <TechnicianFinanceSection 
        activeTechnicians={activeTechnicians} 
      />

      {/* Transactions Section */}
      <TransactionsSection 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default Finance;
