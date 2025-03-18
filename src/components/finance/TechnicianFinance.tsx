
import React, { useState } from 'react';
import { initialTechnicians } from '@/data/technicians';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TechniciansDashboard from '@/components/finance/TechniciansDashboard';
import TechnicianInvoiceSection from '@/components/finance/TechnicianInvoiceSection';
import TechnicianPaymentsSection from '@/components/finance/TechnicianPaymentsSection';

const TechnicianFinance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter only active technicians for the invoice section
  const activeTechnicians = initialTechnicians.filter(tech => tech.status === 'active');

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="dashboard" 
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setRefreshKey(prev => prev + 1); // Force re-render when tab changes
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <TechniciansDashboard key={`dashboard-${refreshKey}`} />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <TechnicianInvoiceSection activeTechnicians={activeTechnicians} />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <TechnicianPaymentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianFinance;
