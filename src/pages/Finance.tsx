
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Finance = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [activeTechnicians, setActiveTechnicians] = useState(initialTechnicians.filter(tech => tech.status === "active"));
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedJobSource, setSelectedJobSource] = useState<string>("all");

  useEffect(() => {
    if (date?.from && date?.to) {
      // First filter by date
      let filtered = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= date.from && transactionDate <= date.to;
      });

      // Then apply additional filters if selected
      if (selectedTechnician !== "all") {
        filtered = filtered.filter(transaction => 
          transaction.technicianName === selectedTechnician
        );
      }

      if (selectedJobSource !== "all") {
        filtered = filtered.filter(transaction => 
          transaction.jobSourceName === selectedJobSource
        );
      }

      setFilteredTransactions(filtered);
    }
  }, [date, transactions, selectedTechnician, selectedJobSource]);

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

  // Get technician names for filter
  const technicianNames = activeTechnicians.map(tech => tech.name);
  // Get job source names for filter
  const jobSourceNames = jobSources.map(source => source.name);

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <DateRangeSelector date={date} setDate={setDate} />
          
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label htmlFor="technician-filter">Filter by Technician</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger id="technician-filter">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {technicianNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-64">
            <Label htmlFor="jobsource-filter">Filter by Job Source</Label>
            <Select value={selectedJobSource} onValueChange={setSelectedJobSource}>
              <SelectTrigger id="jobsource-filter">
                <SelectValue placeholder="Select job source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Sources</SelectItem>
                {jobSourceNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
