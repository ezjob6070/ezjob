
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  SearchIcon,
  Eye,
  CheckCircle,
  Mail,
  Phone,
  Building,
  DollarSign,
  Tag,
  ChevronRight,
  MoreHorizontal,
  CircleAlert,
  Check,
  FileText,
  Handshake,
  Trophy,
  CircleX,
  Briefcase,
  Clock,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { Lead, LeadStatus } from "@/types/lead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusInfo } from "@/components/leads/LeadStatusFilter";
import { Separator } from "@/components/ui/separator";

type LeadsTableProps = {
  leads: Lead[];
  onStatusChange?: (id: string, status: LeadStatus) => void;
};

const LeadsTable = ({ leads: initialLeads, onStatusChange }: LeadsTableProps) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewLeadDialog, setViewLeadDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | "">("");
  const { toast } = useToast();

  const handleSort = (key: keyof Lead) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    
    const sortedLeads = [...leads].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    
    setLeads(sortedLeads);
    setSortConfig({ key, direction });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === "") {
      setLeads(initialLeads);
    } else {
      const filteredLeads = initialLeads.filter(lead => 
        lead.name.toLowerCase().includes(value.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(value.toLowerCase())) ||
        lead.email.toLowerCase().includes(value.toLowerCase()) ||
        lead.source.toLowerCase().includes(value.toLowerCase())
      );
      setLeads(filteredLeads);
    }
  };

  const getSortIcon = (key: keyof Lead) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUpIcon className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDownIcon className="ml-1 h-4 w-4" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSelectedStatus(lead.status);
    setViewLeadDialog(true);
  };

  const getLeadDescription = (lead: Lead) => {
    const description = [];
    if (lead.source) description.push(`Source: ${lead.source}`);
    if (lead.value) description.push(`Value: ${formatCurrency(lead.value)}`);
    if (lead.company) description.push(`Company: ${lead.company}`);
    
    // Add a snippet of notes if available
    if (lead.notes) {
      const notesPreview = lead.notes.length > 60 
        ? `${lead.notes.substring(0, 60)}...` 
        : lead.notes;
      description.push(`Notes: ${notesPreview}`);
    }
    
    return description.join(' • ');
  };

  const handleStatusChange = () => {
    if (!selectedLead || !selectedStatus || selectedStatus === selectedLead.status) return;
    
    // Update local state
    const updatedLeads = leads.map(lead => 
      lead.id === selectedLead.id ? { ...lead, status: selectedStatus } : lead
    );
    setLeads(updatedLeads);
    
    // Call parent callback if provided
    if (onStatusChange) {
      onStatusChange(selectedLead.id, selectedStatus);
    }
    
    // Show success message
    toast({
      title: "Status updated",
      description: `Lead status changed to ${selectedStatus}`,
    });
    
    // Close dialog
    setViewLeadDialog(false);
  };

  // Get suggested next status for inactive leads
  const getQuickActionForStatus = (lead: Lead) => {
    if (lead.status === "inactive") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 hover:text-amber-900"
          onClick={(e) => {
            e.stopPropagation();
            // Update local state
            const updatedLeads = leads.map(l => 
              l.id === lead.id ? { ...l, status: "follow" as LeadStatus } : l
            );
            setLeads(updatedLeads);
            
            // Call parent callback if provided
            if (onStatusChange) {
              onStatusChange(lead.id, "follow");
            }
            
            toast({
              title: "Status updated",
              description: "Lead moved to follow-up status",
            });
          }}
        >
          <CheckCircle className="mr-1 h-3 w-3" /> 
          Follow-up
        </Button>
      );
    }
    return null;
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('');
  };

  // Get avatar style based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-amber-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];
    
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  // Get the next recommended status for a lead
  const getNextRecommendedStatus = (status: LeadStatus): LeadStatus => {
    const flowMap: Record<LeadStatus, LeadStatus> = {
      new: "contacted",
      contacted: "qualified",
      qualified: "proposal",
      proposal: "negotiation",
      negotiation: "won",
      won: "converted",
      lost: "inactive",
      active: "follow",
      inactive: "follow",
      converted: "active",
      follow: "active"
    };
    
    return flowMap[status] || "follow";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Import Leads</DropdownMenuItem>
              <DropdownMenuItem>Bulk Edit</DropdownMenuItem>
              <DropdownMenuItem>Print List</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("name")}
                >
                  Name {getSortIcon("name")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("source")}
                >
                  Source {getSortIcon("source")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("value")}
                >
                  Value {getSortIcon("value")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("createdAt")}
                >
                  Date Added {getSortIcon("createdAt")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => {
                const statusInfo = getStatusInfo(lead.status);
                return (
                  <TableRow key={lead.id} className="group hover:bg-muted/50 cursor-pointer" onClick={() => handleViewLead(lead)}>
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                {lead.company && (
                                  <AvatarImage
                                    src={`https://avatar.vercel.sh/${lead.company.replace(/\s+/g, '-')}.png`}
                                    alt={lead.name}
                                  />
                                )}
                                <AvatarFallback className={getAvatarColor(lead.name)}>
                                  {getInitials(lead.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                {lead.name}
                                {lead.company && (
                                  <div className="text-xs text-muted-foreground">
                                    {lead.company}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3">
                            <div className="font-medium">{lead.name}</div>
                            <p className="text-sm text-muted-foreground">
                              {getLeadDescription(lead)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                        {lead.source || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-green-500" />
                        {formatCurrency(lead.value || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {statusInfo ? (
                          <Badge
                            variant="outline"
                            className={statusInfo.color}
                          >
                            <div className="flex items-center gap-1">
                              {statusInfo.icon}
                              {statusInfo.label}
                            </div>
                          </Badge>
                        ) : (
                          <Badge variant="outline">{lead.status}</Badge>
                        )}
                        {getQuickActionForStatus(lead)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Lead Detail Dialog */}
      <Dialog open={viewLeadDialog} onOpenChange={setViewLeadDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Lead Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {selectedLead.company && (
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${selectedLead.company.replace(/\s+/g, '-')}.png`}
                      alt={selectedLead.name}
                    />
                  )}
                  <AvatarFallback className={getAvatarColor(selectedLead.name)}>
                    {getInitials(selectedLead.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                  {selectedLead.company && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Building className="h-3.5 w-3.5" />
                      {selectedLead.company}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                {getStatusInfo(selectedLead.status) && (
                  <Badge className={`ml-auto ${getStatusInfo(selectedLead.status)?.color}`}>
                    <div className="flex items-center gap-1.5">
                      {getStatusInfo(selectedLead.status)?.icon}
                      {getStatusInfo(selectedLead.status)?.label}
                    </div>
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{selectedLead.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{selectedLead.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Source</p>
                      <p className="text-sm">{selectedLead.source || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Value</p>
                      <p className="text-sm font-semibold">{formatCurrency(selectedLead.value || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Date Added</h4>
                <div className="bg-muted/30 p-3 rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(selectedLead.createdAt), "PPP")}</span>
                </div>
              </div>
              
              {selectedLead.notes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedLead.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Status Change Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Lead Status</h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-blue-800">Recommended Next Step</p>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {getStatusInfo(getNextRecommendedStatus(selectedLead.status))?.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700">
                      Move this lead to the next stage in your sales pipeline based on its current status.
                    </p>
                  </div>
                
                  <RadioGroup 
                    value={selectedStatus} 
                    onValueChange={(value) => setSelectedStatus(value as LeadStatus)}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                  >
                    {Object.entries(statusOptions).map(([key, statusOption]) => (
                      <div key={statusOption.value} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                        <RadioGroupItem 
                          value={statusOption.value} 
                          id={`status-${statusOption.value}`}
                          className="border-gray-300"
                        />
                        <Label 
                          htmlFor={`status-${statusOption.value}`}
                          className={`text-sm flex items-center gap-1.5 ${
                            statusOption.value === selectedLead.status ? 'font-medium' : ''
                          }`}
                        >
                          {statusOption.icon}
                          {statusOption.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setViewLeadDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleStatusChange}
                  disabled={!selectedStatus || selectedStatus === selectedLead.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Define statusOptions here for reference
const statusOptions = [
  {
    value: "new",
    label: "New",
    icon: <CircleAlert className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
  },
  {
    value: "contacted",
    label: "Contacted",
    icon: <Phone className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
  },
  {
    value: "qualified",
    label: "Qualified",
    icon: <Check className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200"
  },
  {
    value: "proposal",
    label: "Proposal",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200"
  },
  {
    value: "negotiation",
    label: "Negotiation",
    icon: <Handshake className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
  },
  {
    value: "won",
    label: "Won",
    icon: <Trophy className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
  },
  {
    value: "lost",
    label: "Lost",
    icon: <CircleX className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
  },
  {
    value: "active",
    label: "Active",
    icon: <Briefcase className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
  },
  {
    value: "converted",
    label: "Converted",
    icon: <Trophy className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
  },
  {
    value: "follow",
    label: "Follow-up",
    icon: <Filter className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
  }
];

export default LeadsTable;
