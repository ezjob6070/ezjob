
import React, { useState } from "react";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { DateRange } from "react-day-picker";
import JobSourceInvoiceSection from "@/components/finance/JobSourceInvoiceSection";
import JobSourceCircleCharts from "@/components/finance/JobSourceCircleCharts";
import JobSourceFilters from "@/components/finance/job-sources/JobSourceFilters";
import JobSourceSearchFilter from "@/components/finance/job-sources/JobSourceSearchFilter";
import JobSourcesTable from "@/components/finance/job-sources/JobSourcesTable";
import { searchJobSource } from "@/components/finance/job-sources/JobSourceUtils";

interface JobSourcesDashboardProps {
  filteredJobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobSourcesDashboard: React.FC<JobSourcesDashboardProps> = ({
  filteredJobSources,
  filteredTransactions,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [categories] = useState<string[]>([
    "Online", "Social Media", "Referral", "Directory", "Advertisement", "Others"
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const jobSourceNames = filteredJobSources.map(source => source.name);

  const clearFilters = () => {
    setSelectedJobSources([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAppliedFilters(false);
  };

  // Apply all the filters to get the final list of job sources
  const filteredSources = filteredJobSources.filter(source => {
    const matchesSelectedSources = 
      !appliedFilters || 
      selectedJobSources.length === 0 || 
      selectedJobSources.includes(source.name);

    const matchesCategory = 
      selectedCategories.length === 0 || 
      (source.category && selectedCategories.includes(source.category)) ||
      (!source.category && selectedCategories.includes("Others"));
    
    let matchesDateRange = true;
    if (appliedFilters && date?.from && source.createdAt) {
      const sourceDate = new Date(source.createdAt);
      matchesDateRange = sourceDate >= date.from;
      
      if (date.to && matchesDateRange) {
        matchesDateRange = sourceDate <= date.to;
      }
    }
    
    return matchesSelectedSources && matchesCategory && matchesDateRange;
  });

  // Apply the search filter
  const searchFilteredSources = filteredSources.filter(source => 
    searchJobSource(source, searchQuery)
  );

  return (
    <div className="space-y-8">
      <JobSourceFilters
        date={date}
        setDate={setDate}
        selectedJobSources={selectedJobSources}
        setSelectedJobSources={setSelectedJobSources}
        jobSourceNames={jobSourceNames}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        clearFilters={clearFilters}
      />
      
      <JobSourceCircleCharts 
        filteredJobSources={filteredSources} 
        date={date}
      />
      
      <JobSourceInvoiceSection 
        jobSources={filteredSources} 
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardDescription>Financial metrics for job sources</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && (
              <div className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {selectedCategories.length === 1 
                  ? `Category: ${selectedCategories[0]}` 
                  : `${selectedCategories.length} categories`}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <JobSourceSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <JobSourcesTable sources={searchFilteredSources} />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourcesDashboard;
