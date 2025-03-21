
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/hooks/useTechniciansData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface JobSourceTableProps {
  jobSources: JobSource[];
  selectedJobSourceId?: string;
  onJobSourceSelect: (jobSource: JobSource) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const JobSourceTable: React.FC<JobSourceTableProps> = ({
  jobSources,
  selectedJobSourceId,
  onJobSourceSelect,
  sortOption,
  onSortChange,
  dateRange,
  setDateRange
}) => {
  if (jobSources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No job sources match your filter criteria.
      </div>
    );
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-t-0 rounded-t-none">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">
            Showing {jobSources.length} job sources
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto gap-1 h-8">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sort</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-0">
              <div className="p-2">
                <div className="text-sm font-medium px-2 py-1.5 text-muted-foreground">
                  Sort by Revenue
                </div>
                <Button
                  variant={sortOption === "revenue-high" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("revenue-high")}
                >
                  Highest first
                </Button>
                <Button
                  variant={sortOption === "revenue-low" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("revenue-low")}
                >
                  Lowest first
                </Button>
                
                <div className="text-sm font-medium px-2 py-1.5 mt-2 text-muted-foreground">
                  Sort by Profit
                </div>
                <Button
                  variant={sortOption === "profit-high" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("profit-high")}
                >
                  Highest first
                </Button>
                <Button
                  variant={sortOption === "profit-low" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("profit-low")}
                >
                  Lowest first
                </Button>
                
                <div className="text-sm font-medium px-2 py-1.5 mt-2 text-muted-foreground">
                  Sort by Jobs Count
                </div>
                <Button
                  variant={sortOption === "jobs-high" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("jobs-high")}
                >
                  Highest first
                </Button>
                <Button
                  variant={sortOption === "jobs-low" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => onSortChange("jobs-low")}
                >
                  Lowest first
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total Jobs</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Company Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobSources.map((source) => {
                const isSelected = source.id === selectedJobSourceId;
                const totalRevenue = source.totalRevenue || 0;
                const expenses = source.expenses || 0;
                const profit = source.companyProfit || 0;
                const profitMargin = totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(1) : "0.0";
                
                return (
                  <TableRow 
                    key={source.id}
                    className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted/50' : ''}`}
                    onClick={() => onJobSourceSelect(source)}
                  >
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
                    <TableCell className="text-right">
                      <span className="font-semibold">{source.totalJobs || 0}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-600">{formatCurrency(totalRevenue)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-red-600">{formatCurrency(expenses)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-green-600">{formatCurrency(profit)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold">{profitMargin}%</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-4 py-3 text-xs">
        <div className="text-muted-foreground">
          Showing {jobSources.length} job sources
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobSourceTable;
