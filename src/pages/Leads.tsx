import { useState } from "react";
import { PlusIcon, FilterIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeadsTable from "@/components/LeadsTable";
import AddLeadModal from "@/components/AddLeadModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DonutChart } from "@/components/DonutChart";
import { ArrowRightIcon } from "@/components/ui/arrow-icon";

// Lead Types and Sample Data
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  value: number;
  assignedTo: string;
  createdAt: Date;
  lastContact?: Date;
  nextFollowUp?: Date;
  notes?: string;
};

const Leads = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: {
      new: true,
      contacted: true,
      qualified: true,
      proposal: true,
      negotiation: true,
      won: true,
      lost: true,
    },
    source: {
      website: true,
      referral: true,
      social: true,
      email: true,
      other: true,
    }
  });

  // Sample leads data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Smith",
      company: "Acme Corp",
      email: "john@acme.com",
      phone: "(555) 123-4567",
      status: "new",
      source: "website",
      value: 5000,
      assignedTo: "Sarah Miller",
      createdAt: new Date("2023-09-15"),
      lastContact: new Date("2023-09-15"),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    {
      id: "2",
      name: "Lisa Johnson",
      company: "Johnson & Co",
      email: "lisa@johnson.com",
      phone: "(555) 987-6543",
      status: "contacted",
      source: "referral",
      value: 10000,
      assignedTo: "Alex Johnson",
      createdAt: new Date("2023-09-10"),
      lastContact: new Date("2023-09-14"),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
    {
      id: "3",
      name: "Michael Brown",
      company: "Brown Industries",
      email: "michael@brown.com",
      phone: "(555) 456-7890",
      status: "qualified",
      source: "social",
      value: 7500,
      assignedTo: "Sarah Miller",
      createdAt: new Date("2023-09-05"),
      lastContact: new Date("2023-09-12"),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
    {
      id: "4",
      name: "Emily Davis",
      company: "Davis Tech",
      email: "emily@davistech.com",
      phone: "(555) 234-5678",
      status: "proposal",
      source: "email",
      value: 15000,
      assignedTo: "Alex Johnson",
      createdAt: new Date("2023-08-28"),
      lastContact: new Date("2023-09-10"),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
    {
      id: "5",
      name: "Robert Wilson",
      company: "Wilson Consulting",
      email: "robert@wilson.com",
      phone: "(555) 876-5432",
      status: "negotiation",
      source: "website",
      value: 20000,
      assignedTo: "Sarah Miller",
      createdAt: new Date("2023-08-15"),
      lastContact: new Date("2023-09-08"),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 4)),
    },
    {
      id: "6",
      name: "Jennifer Lee",
      company: "Lee Enterprises",
      email: "jennifer@lee.com",
      phone: "(555) 345-6789",
      status: "won",
      source: "referral",
      value: 25000,
      assignedTo: "Alex Johnson",
      createdAt: new Date("2023-07-20"),
      lastContact: new Date("2023-08-25"),
    },
    {
      id: "7",
      name: "David Clark",
      company: "Clark Solutions",
      email: "david@clark.com",
      phone: "(555) 654-3210",
      status: "lost",
      source: "social",
      value: 12000,
      assignedTo: "Sarah Miller",
      createdAt: new Date("2023-08-05"),
      lastContact: new Date("2023-08-15"),
    },
  ]);

  // Calculate lead stats for chart
  const statusCounts = {
    new: leads.filter(lead => lead.status === "new").length,
    contacted: leads.filter(lead => lead.status === "contacted").length,
    qualified: leads.filter(lead => lead.status === "qualified").length,
    proposal: leads.filter(lead => lead.status === "proposal").length,
    negotiation: leads.filter(lead => lead.status === "negotiation").length,
    won: leads.filter(lead => lead.status === "won").length,
    lost: leads.filter(lead => lead.status === "lost").length,
  };

  const chartData = [
    { name: "New", value: statusCounts.new, color: "#9b87f5" },
    { name: "Contacted", value: statusCounts.contacted, color: "#D6BCFA" },
    { name: "Qualified", value: statusCounts.qualified, color: "#7E69AB" },
    { name: "Proposal", value: statusCounts.proposal, color: "#6E59A5" },
    { name: "Negotiation", value: statusCounts.negotiation, color: "#FEC6A1" },
    { name: "Won", value: statusCounts.won, color: "#4ade80" },
    { name: "Lost", value: statusCounts.lost, color: "#f87171" },
  ].filter(item => item.value > 0);

  const totalLeadValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonLeadValue = leads.filter(lead => lead.status === "won").reduce((sum, lead) => sum + lead.value, 0);
  const potentialValue = leads.filter(lead => lead.status !== "won" && lead.status !== "lost").reduce((sum, lead) => sum + lead.value, 0);

  // Filter handling
  const handleFilterChange = (
    filterType: "status" | "source",
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [value]: checked,
      },
    }));
  };

  // Add new lead
  const handleAddLead = (newLead: Lead) => {
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  const filteredLeads = leads.filter(lead => {
    const statusMatch = filters.status[lead.status];
    const sourceMatch = filters.source[lead.source];
    const searchMatch = searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let tabMatch = true;
    if (activeTab === "followup") {
      tabMatch = !!lead.nextFollowUp && new Date(lead.nextFollowUp) <= new Date(new Date().setDate(new Date().getDate() + 7));
    } else if (activeTab === "hot") {
      tabMatch = lead.value >= 10000 && (lead.status === "qualified" || lead.status === "proposal" || lead.status === "negotiation");
    } else if (activeTab === "new") {
      tabMatch = lead.status === "new" || lead.status === "contacted";
    } else if (activeTab === "closed") {
      tabMatch = lead.status === "won" || lead.status === "lost";
    }
    
    return statusMatch && sourceMatch && searchMatch && tabMatch;
  });
  
  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Leads Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active: {leads.filter(l => l.status !== "won" && l.status !== "lost").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((statusCounts.won / (statusCounts.won + statusCounts.lost || 1)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Won: {statusCounts.won} | Lost: {statusCounts.lost}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Won Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wonLeadValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${(wonLeadValue / (statusCounts.won || 1)).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Potential Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${potentialValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In Pipeline: {leads.filter(l => l.status !== "won" && l.status !== "lost").length} leads
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
            <CardDescription>Current distribution of leads by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-around">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.new}</div>
                <div className="text-sm text-muted-foreground">New</div>
              </div>
              <ArrowRightIcon />
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.contacted}</div>
                <div className="text-sm text-muted-foreground">Contacted</div>
              </div>
              <ArrowRightIcon />
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.qualified}</div>
                <div className="text-sm text-muted-foreground">Qualified</div>
              </div>
              <ArrowRightIcon />
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.proposal}</div>
                <div className="text-sm text-muted-foreground">Proposal</div>
              </div>
              <ArrowRightIcon />
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.negotiation}</div>
                <div className="text-sm text-muted-foreground">Negotiation</div>
              </div>
              <ArrowRightIcon />
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">{statusCounts.won}</div>
                <div className="text-sm text-muted-foreground">Won</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart 
              data={chartData} 
              title={`${leads.length}`}
              subtitle="Total Leads" 
              size={180}
              thickness={30}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            <TabsTrigger value="new">New Leads</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
            <TabsTrigger value="hot">Hot Leads</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FilterIcon className="h-4 w-4 mr-2" />
              Status Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Lead Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(filters.status).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status[status as keyof typeof filters.status]}
                onCheckedChange={(checked) =>
                  handleFilterChange("status", status, checked)
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FilterIcon className="h-4 w-4 mr-2" />
              Source Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Lead Source</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(filters.source).map((source) => (
              <DropdownMenuCheckboxItem
                key={source}
                checked={filters.source[source as keyof typeof filters.source]}
                onCheckedChange={(checked) =>
                  handleFilterChange("source", source, checked)
                }
              >
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LeadsTable leads={filteredLeads} />
      
      <AddLeadModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddLead={handleAddLead}
      />
    </div>
  );
};

export default Leads;
