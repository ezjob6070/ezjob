
import React from "react";
import { JobSource, FinancialTransaction } from "@/types/finance";
import JobSourceFinance from "@/components/finance/JobSourceFinance";

interface JobSourceFinanceSectionProps {
  jobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
}

const JobSourceFinanceSection: React.FC<JobSourceFinanceSectionProps> = ({
  jobSources,
  filteredTransactions,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Job Source Finance</h3>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <JobSourceFinance jobSources={jobSources} transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default JobSourceFinanceSection;
