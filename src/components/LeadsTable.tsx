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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  SearchIcon,
  Eye,
  CheckCircle
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

type LeadsTableProps = {
  leads: Lead[];
  onStatusChange?: (id: string, status: LeadStatus) => void;
};

const statusColors = {
  new: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  contacted: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  qualified: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  proposal: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  negotiation: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  won: "bg-green-100 text-green-800 hover:bg-green-200",
  lost: "bg-red-100 text-red-800 hover:bg-red-200",
  active: "bg-green-100 text-green-800 hover:bg-green-200",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  converted: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  follow: "bg-amber-100 text-amber-800 hover:bg-amber-200",
};

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  active: "Active",
  inactive: "Inactive",
  converted: "Converted",
  follow: "Follow-up",
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
      description: `Lead status changed to ${statusLabels[selectedStatus]}`,
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
          Move to Follow-up
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center ml-auto space-x-2">
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
              leads.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              {lead.name}
                              <div className="text-sm text-muted-foreground">
                                {lead.email}
                              </div>
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
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{formatCurrency(lead.value || 0)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {format(lead.createdAt, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={statusColors[lead.status]}
                      >
                        {statusLabels[lead.status]}
                      </Badge>
                      {getQuickActionForStatus(lead)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewLead(lead)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Lead Detail Dialog */}
      <Dialog open={viewLeadDialog} onOpenChange={setViewLeadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              Lead Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedLead.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedLead.name}</h3>
                  <p className="text-muted-foreground">{selectedLead.email}</p>
                </div>
                <Badge className={`ml-auto ${statusColors[selectedLead.status]}`}>
                  {statusLabels[selectedLead.status]}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Company</h4>
                  <p>{selectedLead.company || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                  <p>{selectedLead.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Source</h4>
                  <p>{selectedLead.source || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Value</h4>
                  <p className="font-semibold">{formatCurrency(selectedLead.value || 0)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date Added</h4>
                  <p>{format(selectedLead.createdAt, "PPP")}</p>
                </div>
              </div>
              
              {selectedLead.notes && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm">{selectedLead.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Status Change Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Update Lead Status</h4>
                <RadioGroup 
                  value={selectedStatus} 
                  onValueChange={(value) => setSelectedStatus(value as LeadStatus)}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={value} 
                        id={`status-${value}`} 
                        className="border-gray-300"
                      />
                      <Label 
                        htmlFor={`status-${value}`}
                        className={`text-sm ${
                          value === selectedLead.status ? 'font-medium' : ''
                        }`}
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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

export default LeadsTable;
