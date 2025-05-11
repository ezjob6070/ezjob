import React from 'react';
// Ensure proper imports
import { Technician } from '@/types/technician';
import { Job } from '@/types/job';

// Fix the component to correctly use the updated types
const SalesmenDashboard = ({ technicians, jobs }: { technicians: Technician[], jobs: Job[] }) => {
  // Filter salesmen
  const salesmen = technicians.filter(tech => tech.role === 'salesman');
  
  // Check for subRole if needed
  const realEstateSalesmen = salesmen.filter(s => s.subRole === 'real_estate');
  
  // Calculate metrics
  const calculateMetrics = (salesmanId: string) => {
    // Use the correct properties from the Job type
    const salesmanJobs = jobs.filter(job => job.technicianId === salesmanId && 
      new Date(job.date) >= new Date(new Date().setDate(new Date().getDate() - 30)) && 
      new Date(job.date) <= new Date());

    const totalRevenue = salesmanJobs.reduce((sum, job) => sum + (job.totalAmount || 0), 0);
    const jobCount = salesmanJobs.length;
    const averageSaleValue = jobCount > 0 ? totalRevenue / jobCount : 0;
    
    return { totalRevenue, jobCount, averageSaleValue };
  };
  
  // Calculate commission based on payment type and rate
  const calculateCommission = (salesman: Technician, revenue: number) => {
    if (salesman.paymentType === 'percentage') {
      return (salesman.paymentRate / 100) * revenue;
    } else if (salesman.paymentType === 'flat') {
      return salesman.paymentRate * (revenue / 1000); // Example: $X per $1000 in sales
    }
    return 0;
  };
  
  // Prepare data for display
  const salesmenData = salesmen.map(salesman => {
    const { totalRevenue, jobCount, averageSaleValue } = calculateMetrics(salesman.id);
    const commission = calculateCommission(salesman, totalRevenue);
    const profit = totalRevenue - commission;
    
    return {
      ...salesman,
      totalRevenue,
      commission,
      salesCount: jobCount,
      averageSaleValue,
      profit
    };
  });
  
  // Sort by revenue (highest first)
  const sortedSalesmen = [...salesmenData].sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  // Calculate totals
  const totalRevenue = salesmenData.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalCommission = salesmenData.reduce((sum, s) => sum + s.commission, 0);
  const totalProfit = salesmenData.reduce((sum, s) => sum + s.profit, 0);
  const totalSales = salesmenData.reduce((sum, s) => sum + s.salesCount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Last 30 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Commission</div>
          <div className="text-2xl font-bold">${totalCommission.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Last 30 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Net Profit</div>
          <div className="text-2xl font-bold">${totalProfit.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Last 30 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold">{totalSales}</div>
          <div className="text-xs text-gray-400">Last 30 days</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Salesmen Performance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Sale</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedSalesmen.map((salesman) => (
                <tr key={salesman.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                        {salesman.initials || salesman.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{salesman.name}</div>
                        <div className="text-xs text-gray-500">{salesman.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{salesman.subRole || 'General'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    ${salesman.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    {salesman.salesCount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    ${salesman.averageSaleValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    ${salesman.commission.toLocaleString()}
                    <div className="text-xs text-gray-500">
                      {salesman.paymentType === 'percentage' 
                        ? `${salesman.paymentRate}%` 
                        : `$${salesman.paymentRate}/${salesman.paymentType}`}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    ${salesman.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {sortedSalesmen.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                    No salesmen data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesmenDashboard;
