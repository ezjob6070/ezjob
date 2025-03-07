
import React from 'react';

interface JobSourceFinanceProps {
  jobSources: Array<any>;
  transactions: Array<any>;
}

export const JobSourceFinance: React.FC<JobSourceFinanceProps> = ({ jobSources }) => {
  // Fix arithmetic operation errors by ensuring we're working with numbers
  const fixArithmeticOperations = () => {
    // Calculate totals with proper null checking
    const totalExpenses = jobSources.reduce((sum, source) => {
      const expenseValue = typeof source.expenses === 'number' ? source.expenses : 0;
      return sum + expenseValue;
    }, 0);

    const totalCompanyProfit = jobSources.reduce((sum, source) => {
      const profitValue = typeof source.companyProfit === 'number' ? source.companyProfit : 0;
      return sum + profitValue;
    }, 0);

    return { totalExpenses, totalCompanyProfit };
  };

  const { totalExpenses, totalCompanyProfit } = fixArithmeticOperations();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Job Source Finance Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-xl font-semibold">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-sm text-gray-500">Total Company Profit</p>
          <p className="text-xl font-semibold">${totalCompanyProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default JobSourceFinance;
