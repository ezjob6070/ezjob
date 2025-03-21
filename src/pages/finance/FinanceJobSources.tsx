
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { ChevronLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { sampleTransactions } from "@/data/finances";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";
import JobSourceFilterBar from "@/components/finance/jobsource-filters/JobSourceFilterBar";
import { SortOption } from "@/hooks/useTechniciansData";

const FinanceJobSources = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract unique job source names
  const jobSourceNames = [...new Set(jobSources.map(source => source.name))];

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
        category: "online"
      },
      {
        id: "js2", 
        name: "Referral",
        totalJobs: 80,
        totalRevenue: 40000,
        expenses: 8000,
        companyProfit: 18000,
        createdAt: new Date(),
        category: "referral"
      },
      {
        id: "js3",
        name: "Google Ads",
        totalJobs: 150,
        totalRevenue: 70000,
        expenses: 25000,
        companyProfit: 30000,
        createdAt: new Date(),
        category: "marketing"
      },
      {
        id: "js4",
        name: "Social Media",
        totalJobs: 65,
        totalRevenue: 32000,
        expenses: 10000,
        companyProfit: 12000,
        createdAt: new Date(),
        category: "marketing"
      },
      {
        id: "js5",
        name: "Direct Call",
        totalJobs: 95,
        totalRevenue: 48000,
        expenses: 9000,
        companyProfit: 22000,
        createdAt: new Date(),
        category: "other"
      },
    ] as JobSource[];
    
    setJobSources(sources);
  }, []);

  // Functions for handling job source filtering
  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const clearFilters = () => {
    setSelectedJobSources([]);
    setCategoryFilter("all");
    setStatusFilter("all");
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
      to: new Date(),
    });
  };

  const applyFilters = () => {
    // This would normally filter the job sources based on selections
    console.log("Applying filters:", { selectedJobSources, categoryFilter, statusFilter, date });
  };

  // Filter job sources based on selections
  const filteredJobSources = jobSources.filter(source => {
    const matchesJobSource = selectedJobSources.length === 0 || selectedJobSources.includes(source.name);
    const matchesCategory = categoryFilter === "all" || source.category === categoryFilter;
    // We don't have a status property in our sample data, so we'll just return true for now
    const matchesStatus = statusFilter === "all" || true;
    
    return matchesJobSource && matchesCategory && matchesStatus;
  });

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
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <DateRangeSelector date={date} setDate={setDate} />
        </div>
      </div>

      {showFilters && (
        <div className="mb-6">
          <JobSourceFilterBar 
            jobSourceNames={jobSourceNames}
            selectedJobSources={selectedJobSources}
            toggleJobSource={toggleJobSource}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            localDateRange={date}
            setLocalDateRange={setDate}
            sortBy={sortOption}
            setSortBy={setSortOption}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      )}

      {/* Job Source Finance Section */}
      <JobSourceFinanceSection 
        jobSources={filteredJobSources} 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default FinanceJobSources;
