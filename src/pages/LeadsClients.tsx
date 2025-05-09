import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsTable from "@/components/ClientsTable";
import LeadsTable from "@/components/LeadsTable";
import { Button } from "@/components/ui/button";
import { PlusIcon, FilterIcon, SlidersHorizontal } from "lucide-react";
import AddClientModal from "@/components/AddClientModal";
import AddLeadModal from "@/components/AddLeadModal";
import { Lead, LeadStatus } from "@/types/lead"; 
import { useToast } from "@/components/ui/use-toast";
import LeadStatusFilter from "@/components/leads/LeadStatusFilter";
import LeadValueStats from "@/components/leads/LeadValueStats";
import { 
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { initialLeads } from "@/data/leads";

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
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus[]>([]);
  const { toast } = useToast();
  
  // Sample clients data - reusing from the Clients page
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

  // Using the leads data from data/leads.ts
  const [leads, setLeads] = useState<Lead[]>(initialLeads.map(lead => ({
    ...lead,
    createdAt: new Date(lead.dateAdded),
    status: lead.status as LeadStatus
  })));

  const handleAddClient = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  const handleAddLead = (lead: any) => {
    const newLead: Lead = {
      id: lead.id || String(Date.now()),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status || "new",
      source: lead.source,
      value: lead.value,
      createdAt: new Date(),
      notes: lead.notes
    };
    
    setLeads((prevLeads) => [newLead, ...prevLeads]);
    
    toast({
      title: "New lead added",
      description: `${lead.name} has been added as a new lead`,
    });
  };

  const handleLeadStatusChange = (id: string, status: LeadStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      )
    );
    
    toast({
      title: "Lead status updated",
      description: `Lead status has been changed to ${status}`,
    });
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

  // Handle filter toggle
  const handleStatusToggle = (status: LeadStatus) => {
    setLeadStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Get counts of leads by status for the status filter badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(lead => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  // Filter leads based on selected statuses
  const filteredLeads = leadStatusFilter.length > 0
    ? leads.filter(lead => leadStatusFilter.includes(lead.status))
    : leads;

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
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          {activeTab === "leads" && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filter Leads
                  {leadStatusFilter.length > 0 && (
                    <span className="ml-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                      {leadStatusFilter.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Leads</SheetTitle>
                  <SheetDescription>
                    Select statuses to filter your leads
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <LeadStatusFilter 
                    selectedStatuses={leadStatusFilter}
                    onStatusToggle={handleStatusToggle}
                    counts={statusCounts}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setLeadStatusFilter([])}
                      className="mr-2"
                    >
                      Reset Filters
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button type="submit">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        <div className="mt-4">
          <TabsContent value="leads" className="space-y-6">
            {/* Show lead statistics at the top */}
            <LeadValueStats leads={leads} />
            
            {leadStatusFilter.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-700" />
                  <span className="text-sm">
                    Showing <strong>{filteredLeads.length}</strong> leads with 
                    <strong className="mx-1">{leadStatusFilter.length}</strong> 
                    active {leadStatusFilter.length === 1 ? 'filter' : 'filters'}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLeadStatusFilter([])}
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            <LeadsTable 
              leads={filteredLeads} 
              onStatusChange={handleLeadStatusChange} 
            />
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
