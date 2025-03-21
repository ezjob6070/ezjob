
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobSource } from "@/types/finance";
import { DateRange } from "react-day-picker";
import DashboardMetrics from "./dashboard/MetricsCards";
import JobSourceTable from "./job-sources/JobSourceTable";
import JobSourceDetailPanel from "./dashboard/JobSourceDetailPanel";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SortOption } from "@/hooks/useTechniciansData";

interface JobSourcesDashboardProps {
  filteredJobSources: JobSource[];
  filteredTransactions: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobSourcesDashboard: React.FC<JobSourcesDashboardProps> = ({
  filteredJobSources,
  filteredTransactions,
  searchQuery,
  setSearchQuery
}) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today,
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [selectedJobSourceId, setSelectedJobSourceId] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");
  const [displayedJobSources, setDisplayedJobSources] = useState<JobSource[]>(filteredJobSources);
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);

  // Calculate totals for all filtered job sources
  const totalRevenue = filteredJobSources.reduce(
    (sum, source) => sum + (source.totalRevenue || 0), 
    0
  );
  const totalExpenses = filteredJobSources.reduce(
    (sum, source) => sum + (source.expenses || 0), 
    0
  );
  const companyProfit = filteredJobSources.reduce(
    (sum, source) => sum + (source.companyProfit || 0), 
    0
  );

  const dateRangeText = dateRange.from && dateRange.to 
    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    : "All time";

  useEffect(() => {
    setDisplayedJobSources(filteredJobSources);
  }, [filteredJobSources]);

  const handleJobSourceSelect = (jobSource: JobSource) => {
    if (selectedJobSource?.id === jobSource.id) {
      setSelectedJobSource(null);
      setSelectedJobSourceId("");
    } else {
      setSelectedJobSource(jobSource);
      setSelectedJobSourceId(jobSource.id);
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    
    // Sort job sources based on the selected option
    const sortedSources = [...displayedJobSources].sort((a, b) => {
      switch (option) {
        case "revenue-high":
          return (b.totalRevenue || 0) - (a.totalRevenue || 0);
        case "revenue-low":
          return (a.totalRevenue || 0) - (b.totalRevenue || 0);
        case "profit-high":
          return (b.companyProfit || 0) - (a.companyProfit || 0);
        case "profit-low":
          return (a.companyProfit || 0) - (b.companyProfit || 0);
        case "jobs-high":
          return (b.totalJobs || 0) - (a.totalJobs || 0);
        case "jobs-low":
          return (a.totalJobs || 0) - (b.totalJobs || 0);
        default:
          return 0;
      }
    });
    
    setDisplayedJobSources(sortedSources);
  };

  // Search function
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setDisplayedJobSources(filteredJobSources);
    } else {
      const lowercaseQuery = query.toLowerCase();
      const filtered = filteredJobSources.filter(source => 
        source.name.toLowerCase().includes(lowercaseQuery) ||
        (source.category && source.category.toLowerCase().includes(lowercaseQuery))
      );
      setDisplayedJobSources(filtered);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Source Financial Performance</CardTitle>
          <CardDescription>Search, filter, and analyze job source revenue and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardMetrics 
            totalRevenue={totalRevenue}
            totalEarnings={totalExpenses}
            companyProfit={companyProfit}
            dateRangeText={dateRangeText}
          />
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job sources..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <JobSourceTable 
            jobSources={displayedJobSources}
            selectedJobSourceId={selectedJobSourceId}
            onJobSourceSelect={handleJobSourceSelect}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </CardContent>
      </Card>

      {selectedJobSource && (
        <JobSourceDetailPanel 
          selectedJobSource={selectedJobSource}
          dateRangeText={dateRangeText}
        />
      )}
    </div>
  );
};

export default JobSourcesDashboard;
