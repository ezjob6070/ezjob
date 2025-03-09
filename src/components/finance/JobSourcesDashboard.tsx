import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import JobSourceInvoiceSection from "@/components/finance/JobSourceInvoiceSection";
import JobSourceCircleCharts from "@/components/finance/JobSourceCircleCharts";
import CompactDateRangeSelector from "@/components/finance/CompactDateRangeSelector";
import { DateRange } from "react-day-picker";
import JobSourceFiltersPanel from "@/components/finance/JobSourceFiltersPanel";
import JobSourceCategoryFilter from "@/components/finance/jobsource-filters/JobSourceCategoryFilter";

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
  const [categories, setCategories] = useState<string[]>([
    "Online", "Social Media", "Referral", "Directory", "Advertisement", "Others"
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const jobSourceNames = filteredJobSources.map(source => source.name);

  const filteredSources = filteredJobSources.filter(source => {
    const matchesSelectedSources = 
      !appliedFilters || 
      selectedJobSources.length === 0 || 
      selectedJobSources.includes(source.name);

    const matchesCategory = 
      selectedCategories.length === 0 || 
      (source.category && selectedCategories.includes(source.category)) ||
      (!source.category && selectedCategories.includes("Others"));
    
    return matchesSelectedSources && matchesCategory;
  });

  const totalRevenue = filteredSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalExpenses = filteredSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  const totalProfit = filteredSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(t => t !== sourceName)
        : [...prev, sourceName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const selectAllJobSources = () => {
    setSelectedJobSources([...jobSourceNames]);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const clearFilters = () => {
    setSelectedJobSources([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <JobSourceCategoryFilter 
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            categories={categories}
            addCategory={addCategory}
          />
          
          <JobSourceFiltersPanel 
            showFilters={true}
            jobSourceNames={jobSourceNames}
            selectedJobSources={selectedJobSources}
            toggleJobSource={toggleJobSource}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            date={date}
            setDate={setDate}
            selectAllJobSources={selectAllJobSources}
            deselectAllJobSources={deselectAllJobSources}
            compact={true}
          />
          
          <CompactDateRangeSelector date={date} setDate={setDate} />
        </div>
        
        {(selectedJobSources.length > 0 || selectedCategories.length > 0) && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredSources.length} of {filteredJobSources.length} job sources
          </div>
        )}
      </div>
      
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
            <CardTitle>Job Sources Performance</CardTitle>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Completed Jobs</TableHead>
                <TableHead className="text-right">Revenue Generated</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => {
                const totalRevenue = source.totalRevenue || 0;
                const expenses = source.expenses || 0;
                const profit = source.companyProfit || 0;
                const profitMargin = totalRevenue > 0 
                  ? ((profit / totalRevenue) * 100).toFixed(1) 
                  : "0.0";
                
                return (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-2 text-xs">
                          {source.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {source.category || "Others"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{source.totalJobs || 0}</TableCell>
                    <TableCell className="text-right text-sky-600">{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(expenses)}</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatCurrency(profit)}</TableCell>
                    <TableCell className="text-right">{profitMargin}%</TableCell>
                  </TableRow>
                );
              })}
              
              {filteredSources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No job sources match the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourcesDashboard;
