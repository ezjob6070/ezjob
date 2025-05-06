
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsTable from "@/components/ClientsTable";
import LeadsTable from "@/components/LeadsTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddClientModal from "@/components/AddClientModal";
import AddLeadModal from "@/components/leads/AddLeadModal";
import { Lead } from "@/types/lead";

// Import client type from Clients page
type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "lead";
  avatar?: string;
  initials: string;
  paymentStatus?: "current" | "pending" | "overdue";
  paymentAmount?: number;
  createdAt?: Date;
  lastContact?: Date;
};

const LeadsClients = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  
  // Sample clients data - we're reusing the data from the Clients page
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "John Doe",
      company: "Acme Corp",
      email: "john.doe@acme.com",
      phone: "(555) 123-4567",
      status: "active",
      initials: "JD",
      paymentStatus: "current",
      paymentAmount: 1500,
      createdAt: new Date("2023-01-15"),
      lastContact: new Date("2023-08-22"),
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "Tech Solutions Inc.",
      email: "jane.smith@techsolutions.com",
      phone: "(555) 987-6543",
      status: "active",
      initials: "JS",
      paymentStatus: "overdue",
      paymentAmount: 2500,
      createdAt: new Date("2023-02-20"),
      lastContact: new Date("2023-09-05"),
    },
    {
      id: "3",
      name: "Bob Johnson",
      company: "Global Industries",
      email: "bob.johnson@global.com",
      phone: "(555) 456-7890",
      status: "inactive",
      initials: "BJ",
      paymentStatus: "pending",
      paymentAmount: 750,
      createdAt: new Date("2023-03-10"),
      lastContact: new Date("2023-07-15"),
    },
    {
      id: "4",
      name: "Alice Brown",
      company: "Innovative Designs",
      email: "alice.brown@innovative.com",
      phone: "(555) 789-0123",
      status: "lead",
      initials: "AB",
      paymentStatus: "current",
      paymentAmount: 3000,
      createdAt: new Date("2023-04-05"),
      lastContact: new Date("2023-08-10"),
    },
    {
      id: "5",
      name: "Charlie Wilson",
      company: "SoftServe LLC",
      email: "charlie.wilson@softserve.com",
      phone: "(555) 321-0987",
      status: "active",
      initials: "CW",
      paymentStatus: "current",
      paymentAmount: 2000,
      createdAt: new Date("2023-05-12"),
      lastContact: new Date("2023-09-01"),
    },
  ]);

  // Sample leads data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      phone: "(555) 111-2222",
      status: "new",
      source: "Website",
      value: 1200,
      createdAt: new Date("2023-05-01"),
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "(555) 333-4444",
      status: "contacted",
      source: "Referral",
      value: 2500,
      createdAt: new Date("2023-05-03"),
    },
    {
      id: "3",
      name: "David Brown",
      email: "david.b@example.com",
      phone: "(555) 555-6666",
      status: "qualified",
      source: "Google Ad",
      value: 3000,
      createdAt: new Date("2023-05-05"),
    },
    {
      id: "4",
      name: "Emily Davis",
      company: "Davis Designs",
      email: "emily.d@example.com",
      phone: "(555) 777-8888",
      status: "proposal",
      source: "Trade Show",
      value: 5000,
      createdAt: new Date("2023-05-07"),
    },
    {
      id: "5",
      name: "Robert Wilson",
      company: "Wilson Tech",
      email: "robert.w@example.com",
      phone: "(555) 999-0000",
      status: "negotiation",
      source: "LinkedIn",
      value: 7500,
      createdAt: new Date("2023-05-10"),
    },
  ]);

  const handleAddClient = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  const handleAddLead = (lead: Lead) => {
    setLeads((prevLeads) => [lead, ...prevLeads]);
  };

  const getAddButtonText = () => {
    return activeTab === "leads" ? "Add Lead" : "Add Client";
  };

  const handleAddButtonClick = () => {
    if (activeTab === "leads") {
      setShowAddLeadModal(true);
    } else {
      setShowAddClientModal(true);
    }
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Leads & Clients
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your leads and client relationships in one place
          </p>
        </div>
        <Button 
          onClick={handleAddButtonClick}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> {getAddButtonText()}
        </Button>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="leads">
            <LeadsTable leads={leads} />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsTable clients={clients} />
          </TabsContent>
        </div>
      </Tabs>
      
      <AddClientModal 
        open={showAddClientModal}
        onOpenChange={setShowAddClientModal}
        onAddClient={handleAddClient}
      />
      
      <AddLeadModal 
        open={showAddLeadModal}
        onOpenChange={setShowAddLeadModal}
        onAddLead={handleAddLead}
      />
    </div>
  );
};

export default LeadsClients;
