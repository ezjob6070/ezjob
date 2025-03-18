import React, { useState } from "react";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import JobSourceInvoiceSection from "@/components/finance/JobSourceInvoiceSection";
import JobSourceCircleCharts from "@/components/finance/JobSourceCircleCharts";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Search } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isAfter, isBefore, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");

  const jobSourceNames = filteredJobSources.map(source => source.name);

  const handleDatePreset = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        break;
      case "yesterday":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = new Date(from);
        break;
      case "thisWeek":
        from = startOfWeek(today, { weekStartsOn: 1 });
        to = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "lastWeek":
        from = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        to = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "lastMonth":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(subMonths(today, 1));
        break;
      default:
        from = today;
    }
    
    setDate({ from, to });
    setAppliedFilters(true);
  };

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
      matchesDateRange = isAfter(sourceDate, date.from) || isToday(sourceDate);
      
      if (date.to && matchesDateRange) {
        matchesDateRange = isBefore(sourceDate, date.to) || isToday(sourceDate);
      }
    }
    
    return matchesSelectedSources && matchesCategory && matchesDateRange;
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

  const toggleAllJobSources = (checked: boolean) => {
    if (checked) {
      setSelectedJobSources(
        sourceSearchQuery 
          ? jobSourceNames.filter(name => name.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
          : [...jobSourceNames]
      );
    } else {
      setSelectedJobSources([]);
    }
  };

  const searchFilter = (source: JobSource, query: string) => {
    if (!query.trim()) return true;
    
    const searchLower = query.toLowerCase();
    
    const nameMatch = source.name.toLowerCase().includes(searchLower);
    
    const phoneMatch = source.phone?.toLowerCase().includes(searchLower) || false;
    
    const emailMatch = source.email?.toLowerCase().includes(searchLower) || false;
    
    const websiteMatch = source.website?.toLowerCase().includes(searchLower) || false;
    
    const categoryMatch = source.category?.toLowerCase().includes(searchLower) || false;
    
    return nameMatch || phoneMatch || emailMatch || websiteMatch || categoryMatch;
  };

  const filteredJobSourcesForSelection = jobSourceNames.filter(
    source => source.toLowerCase().includes(sourceSearchQuery.toLowerCase())
  );

  const searchFilteredSources = filteredSources.filter(source => searchFilter(source, searchQuery));

  const clearFilters = () => {
    setSelectedJobSources([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAppliedFilters(false);
    setSourceSearchQuery("");
  };

  const applyFilters = () => {
    setAppliedFilters(true);
    setShowSourceFilter(false);
    setShowDateFilter(false);
  };

  const allJobSourcesSelected = 
    filteredJobSourcesForSelection.length > 0 && 
    filteredJobSourcesForSelection.every(source => selectedJobSources.includes(source));
  
  const someJobSourcesSelected = 
    selectedJobSources.length > 0 && 
    !allJobSourcesSelected;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-6">
        <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM d, yyyy")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("today")}>Today</Button>
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("yesterday")}>Yesterday</Button>
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisWeek")}>This Week</Button>
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastWeek")}>Last Week</Button>
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisMonth")}>This Month</Button>
                <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastMonth")}>Last Month</Button>
              </div>
              <div className="text-sm font-medium mb-2">Custom Range</div>
              <CalendarComponent
                mode="range"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </div>
            <div className="p-3 flex justify-between">
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
              <Button variant="default" size="sm" onClick={applyFilters}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showSourceFilter} onOpenChange={setShowSourceFilter}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {selectedJobSources.length > 0 
                ? `${selectedJobSources.length} sources selected` 
                : "Filter Job Sources"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="p-3">
              <Input 
                type="text" 
                placeholder="Search sources..." 
                className="mb-3" 
                value={sourceSearchQuery}
                onChange={(e) => setSourceSearchQuery(e.target.value)}
              />
              <div className="flex items-center space-x-2 py-2 border-b border-gray-200 mb-2">
                <Checkbox 
                  id="select-all-sources"
                  checked={allJobSourcesSelected}
                  data-state={
                    someJobSourcesSelected 
                      ? "indeterminate" 
                      : allJobSourcesSelected 
                        ? "checked" 
                        : "unchecked"
                  }
                  onCheckedChange={toggleAllJobSources}
                />
                <label 
                  htmlFor="select-all-sources"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All Job Sources
                </label>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredJobSourcesForSelection.map(source => (
                  <div key={source} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`source-${source}`} 
                      checked={selectedJobSources.includes(source)}
                      onCheckedChange={() => toggleJobSource(source)}
                    />
                    <label 
                      htmlFor={`source-${source}`}
                      className="text-sm cursor-pointer"
                    >
                      {source}
                    </label>
                  </div>
                ))}
                {filteredJobSourcesForSelection.length === 0 && (
                  <div className="text-sm text-muted-foreground py-2">No job sources found</div>
                )}
              </div>
            </div>
            <div className="border-t p-3 flex justify-between">
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
              <Button variant="default" size="sm" onClick={applyFilters}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>

        {appliedFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
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
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search job sources by name, phone, email, website, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
              {searchFilteredSources.map((source) => {
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
              
              {searchFilteredSources.length === 0 && (
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
