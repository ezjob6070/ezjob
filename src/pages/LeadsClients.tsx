
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsTable from "@/components/ClientsTable";
import LeadsTable from "@/components/leads/LeadsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusIcon, 
  CheckIcon, 
  XIcon, 
  ArrowRightIcon, 
  SearchIcon, 
  Filter, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import AddClientModal from "@/components/AddClientModal";
import AddLeadModal from "@/components/leads/AddLeadModal";
import { Lead, LeadStatus, LEAD_STATUS_COLORS } from "@/types/lead";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [leadStatusFilter, setLeadStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();
  
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
      source: "Google Ads",
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
      service: "Remodeling",
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
      service: "Electrical",
    },
    {
      id: "6",
      name: "Jennifer Lee",
      company: "Lee Consulting",
      email: "jennifer.l@example.com",
      phone: "(555) 111-3333",
      status: "active",
      source: "Email Campaign",
      value: 9000,
      createdAt: new Date("2023-05-12"),
      service: "HVAC",
    },
    {
      id: "7",
      name: "Thomas Baker",
      email: "thomas.b@example.com",
      phone: "(555) 222-4444",
      status: "follow",
      source: "Partner",
      value: 3500,
      createdAt: new Date("2023-05-15"),
      service: "Plumbing",
    },
    {
      id: "8",
      name: "Lisa Campbell",
      company: "Campbell Properties",
      email: "lisa.c@example.com",
      phone: "(555) 333-5555",
      status: "converted",
      source: "Website",
      value: 12000,
      createdAt: new Date("2023-05-18"),
      service: "General Contracting",
    },
  ]);

  const handleAddClient = (newClient: Client) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  const handleAddLead = (lead: any) => {
    // Ensure the lead conforms to the Lead type from types/lead.ts
    const newLead: Lead = {
      id: lead.id || String(Date.now()),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      service: lead.service,
      status: lead.status || "new",
      source: lead.source,
      value: lead.value,
      createdAt: new Date(),
      notes: lead.notes,
      estimatedClosingDate: lead.estimatedClosingDate,
      priority: lead.priority,
    };
    
    setLeads((prevLeads) => [newLead, ...prevLeads]);
    
    toast({
      title: "Lead added",
      description: "New lead has been added successfully",
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

  const handleEditLead = (lead: Lead) => {
    // This would typically open an edit modal
    toast({
      title: "Edit Lead",
      description: `Editing lead: ${lead.name}`,
    });
  };

  const handleViewLeadDetails = (lead: Lead) => {
    // This would typically open a detailed view
    toast({
      title: "View Lead Details",
      description: `Viewing details for ${lead.name}`,
    });
  };

  // Get counts of leads by status for the status filter badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      active: 0,
      inactive: 0,
      converted: 0,
      follow: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0
    };
    
    leads.forEach(lead => {
      if (lead.status in counts) {
        counts[lead.status]++;
      }
    });
    
    return counts;
  }, [leads]);

  // Filter leads based on selected statuses, search term, and source
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Status filter
      if (leadStatusFilter.length > 0 && !leadStatusFilter.includes(lead.status)) {
        return false;
      }
      
      // Search term filter
      if (searchTerm && 
          !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !lead.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Source filter
      if (leadSourceFilter && lead.source !== leadSourceFilter) {
        return false;
      }
      
      // Date range filter
      if (dateRange.from && dateRange.to) {
        const leadDate = new Date(lead.createdAt);
        if (leadDate < dateRange.from || leadDate > dateRange.to) {
          return false;
        }
      }
      
      return true;
    });
  }, [leads, leadStatusFilter, searchTerm, leadSourceFilter, dateRange]);
  
  // Get unique sources for filter
  const leadSources = useMemo(() => {
    const sources = new Set<string>();
    leads.forEach(lead => {
      if (lead.source) {
        sources.add(lead.source);
      }
    });
    return Array.from(sources);
  }, [leads]);

  const clearFilters = () => {
    setLeadStatusFilter([]);
    setSearchTerm("");
    setLeadSourceFilter("");
    setDateRange({
      from: undefined,
      to: undefined
    });
  };

  // Format date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    return "All dates";
  };

  const hasFilters = leadStatusFilter.length > 0 || searchTerm || leadSourceFilter || dateRange.from;

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
          onClick={activeTab === "leads" ? () => setShowAddLeadModal(true) : () => setShowAddClientModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> 
          {activeTab === "leads" ? "Add Lead" : "Add Client"}
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
        
        {activeTab === "leads" && (
          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow max-w-md">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={leadSourceFilter} onValueChange={setLeadSourceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All sources</SelectItem>
                    {leadSources.map(source => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 w-[180px]">
                      <CalendarIcon className="h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={dateRange as any}
                      onSelect={setDateRange as any}
                      numberOfMonths={2}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                
                {hasFilters && (
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <ToggleGroup type="multiple" className="justify-start flex-wrap gap-2" value={leadStatusFilter} onValueChange={setLeadStatusFilter}>
                  {Object.entries(statusCounts).map(([status, count]) => (
                    count > 0 ? (
                      <div key={status} className="flex flex-col items-center">
                        <ToggleGroupItem 
                          value={status} 
                          aria-label={status} 
                          className={`flex items-center gap-1 ${LEAD_STATUS_COLORS[status as LeadStatus]}`}
                        >
                          {status === "active" && <CheckIcon className="h-4 w-4" />}
                          {status === "inactive" && <XIcon className="h-4 w-4" />}
                          {status === "follow" && <ArrowRightIcon className="h-4 w-4" />}
                          {status === "converted" && <CheckIcon className="h-4 w-4" />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </ToggleGroupItem>
                        <span className="text-xs mt-1 font-medium">{count}</span>
                      </div>
                    ) : null
                  ))}
                </ToggleGroup>
              </div>
            </div>
            
            {hasFilters && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredLeads.length} of {leads.length} leads
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <TabsContent value="leads">
            <LeadsTable 
              leads={filteredLeads} 
              onEditLead={handleEditLead}
              onViewDetails={handleViewLeadDetails}
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
