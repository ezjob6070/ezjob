
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";

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
  // Calculate total revenue and profit for donut charts
  const totalRevenue = filteredJobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalProfit = filteredJobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);

  return (
    <div className="space-y-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Job Sources Performance</CardTitle>
          <CardDescription>Revenue and profit by job source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Revenue Distribution</h3>
              <DonutChart
                data={filteredJobSources.map((source, index) => ({
                  name: source.name,
                  value: source.totalRevenue || 0,
                  color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                }))}
                title={formatCurrency(totalRevenue)}
                subtitle="Total Revenue"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Profit Distribution</h3>
              <DonutChart
                data={filteredJobSources.map((source, index) => ({
                  name: source.name,
                  value: source.companyProfit || 0,
                  color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                }))}
                title={formatCurrency(totalProfit)}
                subtitle="Total Profit"
              />
            </div>
          </div>
          
          <Input
            className="mb-4"
            placeholder="Search job sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <JobSourceFinanceSection 
            jobSources={filteredJobSources} 
            filteredTransactions={filteredTransactions} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourcesDashboard;
