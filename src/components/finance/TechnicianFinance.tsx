
import React, { useState } from 'react';
import { initialTechnicians } from '@/data/technicians';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TechniciansDashboard from '@/components/finance/TechniciansDashboard';
import TechnicianInvoiceSection from '@/components/finance/TechnicianInvoiceSection';
import TechnicianPaymentsSection from '@/components/finance/TechnicianPaymentsSection';
import InvoiceButton from '@/components/finance/InvoiceButton';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';

const TechnicianFinance = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter only active technicians for the invoice section
  const activeTechnicians = initialTechnicians.filter(tech => tech.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Technician Financial Management</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setActiveTab("invoices")}
          >
            <FileText className="h-4 w-4" />
            Generate Invoice
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>
      
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
          <TechniciansDashboard 
            key={`dashboard-${refreshKey}`} 
            activeTechnicians={activeTechnicians}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <TechnicianInvoiceSection activeTechnicians={activeTechnicians} />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-6">
          <TechnicianPaymentsSection technicians={activeTechnicians} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianFinance;
