import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsTable from "@/components/ClientsTable";
import LeadsTable from "@/components/LeadsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, FilterIcon, SlidersHorizontal, Search, ArrowUpDown } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
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
  const [leadSort, setLeadSort] = useState("date-desc");
  const [clientSort, setClientSort] = useState("date-desc");
  const [leadStatus, setLeadStatus] = useState<string>("all");
  const [clientStatus, setClientStatus] = useState<string>("all");
  const [leadFrom, setLeadFrom] = useState<string>("");
  const [leadTo, setLeadTo] = useState<string>("");
  const [clientFrom, setClientFrom] = useState<string>("");
  const [clientTo, setClientTo] = useState<string>("");
  const [hideConverted, setHideConverted] = useState<boolean>(true);
  const [convertTarget, setConvertTarget] = useState<Lead | null>(null);
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

  const computeInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() || "?";
  };

  const performConvert = (lead: Lead) => {
    const existing = clients.find(c => c.email && lead.email && c.email.toLowerCase() === lead.email.toLowerCase());
    if (existing) {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "converted" } : l));
      toast({
        title: "Client already exists",
        description: `${lead.name} is already a client. Lead marked as converted.`,
      });
      setConvertTarget(null);
      return;
    }
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: lead.name,
      company: lead.company ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      status: "active",
      initials: computeInitials(lead.name),
      createdAt: new Date(),
      lastContact: new Date(),
    };
    setClients(prev => [newClient, ...prev]);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "converted" } : l));
    toast({
      title: "Lead converted",
      description: `${lead.name} has been converted to a client.`,
    });
    setConvertTarget(null);
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

  // Filter + sort leads
  const filteredLeads = useMemo(() => {
    let list = leadStatusFilter.length > 0
      ? leads.filter(lead => leadStatusFilter.includes(lead.status))
      : leads;
    if (hideConverted && leadStatus !== "converted") {
      list = list.filter(l => l.status !== "converted");
    }
    if (leadStatus !== "all") {
      list = list.filter(l => l.status === leadStatus);
    }
    if (leadFrom) {
      const from = new Date(leadFrom).getTime();
      list = list.filter(l => new Date(l.createdAt).getTime() >= from);
    }
    if (leadTo) {
      const to = new Date(leadTo).getTime() + 24 * 60 * 60 * 1000 - 1;
      list = list.filter(l => new Date(l.createdAt).getTime() <= to);
    }
    const sorted = [...list];
    switch (leadSort) {
      case "name-asc": sorted.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "name-desc": sorted.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "date-asc": sorted.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "date-desc": sorted.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }
    return sorted;
  }, [leads, leadStatusFilter, leadStatus, leadFrom, leadTo, leadSort]);

  // Filter + sort clients
  const filteredClients = useMemo(() => {
    let list = clients;
    if (clientStatus !== "all") {
      list = list.filter(c => c.status === clientStatus);
    }
    if (clientFrom) {
      const from = new Date(clientFrom).getTime();
      list = list.filter(c => (c.createdAt?.getTime() ?? 0) >= from);
    }
    if (clientTo) {
      const to = new Date(clientTo).getTime() + 24 * 60 * 60 * 1000 - 1;
      list = list.filter(c => (c.createdAt?.getTime() ?? 0) <= to);
    }
    const sorted = [...list];
    switch (clientSort) {
      case "name-asc": sorted.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "name-desc": sorted.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "date-asc": sorted.sort((a,b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)); break;
      case "date-desc": sorted.sort((a,b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)); break;
    }
    return sorted;
  }, [clients, clientStatus, clientFrom, clientTo, clientSort]);

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

            <div className="flex flex-wrap gap-3 items-end bg-gray-50 border rounded-lg p-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Status</label>
                <Select value={leadStatus} onValueChange={setLeadStatus}>
                  <SelectTrigger className="w-[160px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">From</label>
                <Input type="date" value={leadFrom} onChange={(e) => setLeadFrom(e.target.value)} className="w-[160px] bg-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">To</label>
                <Input type="date" value={leadTo} onChange={(e) => setLeadTo(e.target.value)} className="w-[160px] bg-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Sort by</label>
                <Select value={leadSort} onValueChange={setLeadSort}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(leadStatus !== "all" || leadFrom || leadTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setLeadStatus("all"); setLeadFrom(""); setLeadTo(""); }}>
                  Clear
                </Button>
              )}
            </div>

            <LeadsTable 
              leads={filteredLeads} 
              onStatusChange={handleLeadStatusChange} 
            />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <div className="flex flex-wrap gap-3 items-end bg-gray-50 border rounded-lg p-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Status</label>
                <Select value={clientStatus} onValueChange={setClientStatus}>
                  <SelectTrigger className="w-[160px] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">From</label>
                <Input type="date" value={clientFrom} onChange={(e) => setClientFrom(e.target.value)} className="w-[160px] bg-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">To</label>
                <Input type="date" value={clientTo} onChange={(e) => setClientTo(e.target.value)} className="w-[160px] bg-white" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Sort by</label>
                <Select value={clientSort} onValueChange={setClientSort}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(clientStatus !== "all" || clientFrom || clientTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setClientStatus("all"); setClientFrom(""); setClientTo(""); }}>
                  Clear
                </Button>
              )}
            </div>
            <ClientsTable clients={filteredClients} />
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
