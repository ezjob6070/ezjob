
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { financeTabOptions, FinanceTabId } from "@/components/finance/FinanceTabConfig";
import FinancePageHeader from "@/components/finance/FinancePageHeader";
import RealEstateFinanceDashboard from "@/components/finance/RealEstateFinanceDashboard";
import AgentsFinanceSection from "@/components/finance/AgentsFinanceSection";
import PropertiesFinanceSection from "@/components/finance/PropertiesFinanceSection";
import TransactionsDashboard from "@/components/finance/TransactionsDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const Finance = () => {
  const [activeTab, setActiveTab] = useState<FinanceTabId>("overview");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  
  const { jobs } = useGlobalState();
  
  // Filter jobs based on date range
  const filteredJobs = jobs.filter(job => 
    job.status === "completed" && 
    (!date?.from || (job.scheduledDate && new Date(job.scheduledDate) >= date.from)) && 
    (!date?.to || (job.scheduledDate && new Date(job.scheduledDate) <= date.to))
  );
  
  // Calculate total metrics from filtered job data
  const totalRevenue = filteredJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount || 0), 0);
  const totalExpenses = totalRevenue * 0.4; // 40% expense ratio for real estate
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="container py-6">
      <FinancePageHeader />

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as FinanceTabId)}
            className="w-full"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList className="bg-white/50">
                {financeTabOptions.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <RealEstateFinanceDashboard 
                  totalRevenue={totalRevenue}
                  totalExpenses={totalExpenses}
                  totalProfit={totalProfit}
                  date={date}
                />
              </TabsContent>

              <TabsContent value="properties" className="mt-0">
                <PropertiesFinanceSection date={date} />
              </TabsContent>

              <TabsContent value="agents" className="mt-0">
                <AgentsFinanceSection date={date} />
              </TabsContent>

              <TabsContent value="transactions" className="mt-0">
                <TransactionsDashboard 
                  filteredTransactions={filteredJobs.map(job => ({
                    id: job.id,
                    date: new Date(job.scheduledDate || Date.now()),
                    type: 'sale',
                    amount: job.actualAmount || job.amount || 0,
                    description: job.description || '',
                    status: job.status,
                    clientName: job.clientName || '',
                    propertyAddress: job.location || ''
                  }))}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;
