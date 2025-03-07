import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search as SearchIcon
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonutChart } from "@/components/DonutChart";
import { ArrowRightIcon } from "@/components/ui/arrow-icon";

type Lead = {
  id: string;
  name: string;
  company: string;
  status: "New" | "Contacting" | "Qualified" | "Lost";
  dateCreated: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  source: string;
  value: number;
  assignedTo: string;
};

const sampleLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    company: "Acme Corp",
    status: "New",
    dateCreated: "2023-09-01",
    contactInfo: {
      email: "john.doe@example.com",
      phone: "123-456-7890",
    },
    source: "Website",
    value: 5000,
    assignedTo: "Alex Johnson",
  },
  {
    id: "2",
    name: "Jane Smith",
    company: "Tech Solutions Inc.",
    status: "Contacting",
    dateCreated: "2023-09-05",
    contactInfo: {
      email: "jane.smith@techsolutions.com",
      phone: "987-654-3210",
    },
    source: "Referral",
    value: 7500,
    assignedTo: "Sarah Miller",
  },
  {
    id: "3",
    name: "Robert Wilson",
    company: "Global Innovations",
    status: "Qualified",
    dateCreated: "2023-09-10",
    contactInfo: {
      email: "robert.wilson@globalinnovations.com",
      phone: "555-123-4567",
    },
    source: "LinkedIn",
    value: 10000,
    assignedTo: "Alex Johnson",
  },
  {
    id: "4",
    name: "Emily Brown",
    company: "Sunrise Marketing",
    status: "Lost",
    dateCreated: "2023-09-15",
    contactInfo: {
      email: "emily.brown@sunrisemarketing.com",
      phone: "111-222-3333",
    },
    source: "Cold Call",
    value: 2500,
    assignedTo: "Sarah Miller",
  },
];

const statusCounts = {
  New: sampleLeads.filter((lead) => lead.status === "New").length,
  Contacting: sampleLeads.filter((lead) => lead.status === "Contacting").length,
  Qualified: sampleLeads.filter((lead) => lead.status === "Qualified").length,
  Lost: sampleLeads.filter((lead) => lead.status === "Lost").length,
};

const totalLeads = sampleLeads.length;

const Leads = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLeads = sampleLeads.filter((lead) => {
    const searchMatch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === "all" || lead.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const leadSources = [
    { name: "Website", value: 35 },
    { name: "Referrals", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Direct", value: 15 },
    { name: "Other", value: 5 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Create a new lead to track potential clients.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value="pedro@example.com" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input id="phone" value="212-987-6543" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacting">Contacting</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Lead</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Leads ({totalLeads})</TabsTrigger>
          <TabsTrigger value="new">New ({statusCounts.New})</TabsTrigger>
          <TabsTrigger value="contacting">Contacting ({statusCounts.Contacting})</TabsTrigger>
          <TabsTrigger value="qualified">Qualified ({statusCounts.Qualified})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({statusCounts.Lost})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <p className="mt-2 text-sm text-muted-foreground">
            All leads are shown here.
          </p>
        </TabsContent>
        <TabsContent value="new">
          <p className="mt-2 text-sm text-muted-foreground">
            New leads are shown here.
          </p>
        </TabsContent>
        <TabsContent value="contacting">
          <p className="mt-2 text-sm text-muted-foreground">
            Leads being contacted are shown here.
          </p>
        </TabsContent>
        <TabsContent value="qualified">
          <p className="mt-2 text-sm text-muted-foreground">
            Qualified leads are shown here.
          </p>
        </TabsContent>
        <TabsContent value="lost">
          <p className="mt-2 text-sm text-muted-foreground">
            Lost leads are shown here.
          </p>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.New}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((statusCounts.New / totalLeads) * 100)}% of total leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacting Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Contacting}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((statusCounts.Contacting / totalLeads) * 100)}% of total leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Qualified}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((statusCounts.Qualified / totalLeads) * 100)}% of total leads
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lead Pipeline</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search leads..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleStatusChange("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("New")}>
                  New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("Contacting")}>
                  Contacting
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("Qualified")}>
                  Qualified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("Lost")}>
                  Lost
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.status === 'Qualified' ? 'success' : 
                      lead.status === 'New' ? 'default' : 
                      lead.status === 'Contacting' ? 'secondary' : 
                      'destructive'
                    }>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.dateCreated}</TableCell>
                  <TableCell>
                    {lead.contactInfo.email}
                    <br />
                    {lead.contactInfo.phone}
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{formatCurrency(lead.value)}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {totalLeads} leads
            </p>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Leads by Source</CardTitle>
            <div className="flex mt-2 space-x-2">
              <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Source</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="space-y-3">
                  {leadSources.map((source) => (
                    <div key={source.name} className="flex items-center">
                      <div className="w-32 mr-2">
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${source.value}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lead Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart 
              data={[
                { name: "New", value: statusCounts.New, color: "#3b82f6" },
                { name: "Contacting", value: statusCounts.Contacting, color: "#8b5cf6" },
                { name: "Qualified", value: statusCounts.Qualified, color: "#22c55e" },
                { name: "Lost", value: statusCounts.Lost, color: "#ef4444" }
              ]}
              title={`${Math.round((statusCounts.Qualified / totalLeads) * 100)}%`}
              subtitle="Conversion Rate"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leads;
