
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction, ProfitBreakdownItem } from "@/types/finance";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import TransactionsSection from "@/components/finance/TransactionsSection";
import ReportGenerator from "@/components/finance/ReportGenerator";
import { DateRange } from "react-day-picker";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import AgentsFinanceSection from "@/components/finance/AgentsFinanceSection";
import PropertiesFinanceSection from "@/components/finance/PropertiesFinanceSection";

interface OverviewDashboardProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  jobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
  expenseCategories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
  jobSources,
  filteredTransactions,
  expenseCategories,
  date,
  setDate
}) => {
  const { currentIndustry } = useGlobalState();
  
  if (currentIndustry === 'real_estate') {
    // Real estate specific breakdown
    const realEstateRevenueBreakdown = [
      { name: "Sales Commission", value: totalRevenue * 0.6, color: "#3b82f6" },
      { name: "Rental Commission", value: totalRevenue * 0.25, color: "#10b981" },
      { name: "Property Management", value: totalRevenue * 0.15, color: "#8b5cf6" }
    ];
    
    const realEstateExpenseBreakdown = [
      { name: "Marketing", value: totalExpenses * 0.4, color: "#ef4444" },
      { name: "Agent Commissions", value: totalExpenses * 0.35, color: "#f97316" },
      { name: "Administrative", value: totalExpenses * 0.25, color: "#8b5cf6" }
    ];
    
    return (
      <div className="space-y-8">
        <OverallFinanceSection 
          totalRevenue={totalRevenue} 
          totalExpenses={totalExpenses} 
          totalProfit={totalProfit}
          date={date}
          setDate={setDate}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Real estate revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-4 text-blue-600">{formatCurrency(totalRevenue)}</div>
              
              <div className="space-y-4">
                {realEstateRevenueBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">{formatCurrency(item.value)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : "0"}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Real estate operational costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-4 text-red-600">-{formatCurrency(totalExpenses)}</div>
              
              <div className="space-y-4">
                {realEstateExpenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">-{formatCurrency(item.value)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : "0"}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AgentsFinanceSection 
            activeAgents={[]} 
            dateRange={date} 
            setDateRange={setDate}
          />
          <PropertiesFinanceSection 
            properties={[]} 
            dateRange={date} 
            setDateRange={setDate}
          />
        </div>
        
        <ReportGenerator dateRange={date} />
        
        <TransactionsSection filteredTransactions={filteredTransactions.slice(0, 5)} />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <OverallFinanceSection 
        totalRevenue={totalRevenue} 
        totalExpenses={totalExpenses} 
        totalProfit={totalProfit}
        date={date}
        setDate={setDate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Source of revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-4 text-blue-600">{formatCurrency(totalRevenue)}</div>
            
            <div className="space-y-4">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">{formatCurrency(item.value)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : "0"}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-4 text-red-600">-{formatCurrency(totalExpenses)}</div>
            
            <div className="space-y-4">
              {expenseCategories.length > 0 ? (
                expenseCategories.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">-{formatCurrency(item.value)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : "0"}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                [
                  { name: "Materials", value: totalExpenses * 0.5, color: "#ef4444" },
                  { name: "Labor", value: totalExpenses * 0.3, color: "#f97316" },
                  { name: "Overhead", value: totalExpenses * 0.2, color: "#8b5cf6" }
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">-{formatCurrency(item.value)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : "0"}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Net Profit Breakdown</CardTitle>
            <CardDescription>How profit is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold mb-4 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? formatCurrency(totalProfit) : `-${formatCurrency(Math.abs(totalProfit))}`}
            </div>
            
            <div className="space-y-4">
              {profitBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {totalProfit >= 0 
                        ? formatCurrency(item.value) 
                        : `-${formatCurrency(Math.abs(item.value))}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({totalProfit !== 0 ? ((item.value / Math.abs(totalProfit)) * 100).toFixed(1) : "0"}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ReportGenerator dateRange={date} />
      
      <Card>
        <CardHeader>
          <CardTitle>Top Job Sources</CardTitle>
          <CardDescription>Best performing job sources by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Source Name</TableHead>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Source Cost</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Company Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobSources
                .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                .slice(0, 5)
                .map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{source.totalJobs}</TableCell>
                    <TableCell className="text-right text-blue-600">{formatCurrency(source.totalRevenue || 0)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency((source.expenses || 0) * 0.4)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(source.expenses || 0)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(source.companyProfit || 0)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <TransactionsSection filteredTransactions={filteredTransactions.slice(0, 5)} />
    </div>
  );
};

export default OverviewDashboard;
