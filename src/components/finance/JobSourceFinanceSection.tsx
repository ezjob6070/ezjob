
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobSource, FinancialTransaction, TimeFrame } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import JobSourceTable from "./job-sources/JobSourceTable";
import { SortOption } from "@/hooks/useTechniciansData";
import { DateRange } from "react-day-picker";
import JobSourceDetailPanel from "./dashboard/JobSourceDetailPanel";
import FinancialMetricsCards from "./FinancialMetricsCards";
import JobSourceInvoiceSection from "./JobSourceInvoiceSection";

interface JobSourceFinanceSectionProps {
  jobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
}

const JobSourceFinanceSection: React.FC<JobSourceFinanceSectionProps> = ({
  jobSources,
  filteredTransactions
}) => {
  const [selectedJobSourceId, setSelectedJobSourceId] = useState<string>("");
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today,
  });

  // Calculate totals
  const totalRevenue = jobSources.reduce(
    (sum, source) => sum + (source.totalRevenue || 0), 
    0
  );
  const totalExpenses = jobSources.reduce(
    (sum, source) => sum + (source.expenses || 0), 
    0
  );
  const companyProfit = jobSources.reduce(
    (sum, source) => sum + (source.companyProfit || 0), 
    0
  );

  const jobSourceReport = {
    totalRevenue,
    totalExpenses,
    companyProfit,
    technicianPayments: 0,
    transactions: filteredTransactions,
    timeFrame: "custom" as TimeFrame,
    startDate: dateRange.from || new Date(),
    endDate: dateRange.to || new Date()
  };

  const dateRangeText = dateRange.from && dateRange.to 
    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
    : "All time";

  const handleJobSourceSelect = (jobSource: JobSource) => {
    if (selectedJobSource?.id === jobSource.id) {
      setSelectedJobSource(null);
      setSelectedJobSourceId("");
    } else {
      setSelectedJobSource(jobSource);
      setSelectedJobSourceId(jobSource.id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Source Financial Overview</CardTitle>
          <p className="text-muted-foreground text-sm">
            Financial performance overview for all job sources
          </p>
        </CardHeader>
        <CardContent>
          <FinancialMetricsCards report={jobSourceReport} />
          
          <div className="mt-6">
            <JobSourceTable 
              jobSources={jobSources}
              selectedJobSourceId={selectedJobSourceId}
              onJobSourceSelect={handleJobSourceSelect}
              sortOption={sortOption}
              onSortChange={setSortOption}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </CardContent>
      </Card>

      {selectedJobSource && (
        <JobSourceDetailPanel 
          selectedJobSource={selectedJobSource}
          dateRangeText={dateRangeText}
        />
      )}
      
      <JobSourceInvoiceSection jobSources={jobSources} />
    </div>
  );
};

export default JobSourceFinanceSection;
