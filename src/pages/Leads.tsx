import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, UserIcon, CheckSquareIcon } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { initialLeads } from "@/data/leads";
import AddLeadModal from "@/components/leads/AddLeadModal";
import EditLeadModal from "@/components/leads/EditLeadModal";
import LeadsTable from "@/components/leads/LeadsTable";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  source: string;
  value: number;
  dateAdded: Date;
  status: "active" | "converted" | "inactive";
  notes?: string;
};

const Leads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeLeadDetailsDialog, setActiveLeadDetailsDialog] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    // Simulate fetching leads from an API or database
    // In a real application, you would fetch the leads here
    // and update the state with the fetched data
  }, []);

  const handleAddLead = (newLead: Lead) => {
    setLeads((prevLeads) => [newLead, ...prevLeads]);
    toast({
      title: "Success",
      description: "New lead added successfully",
    });
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditLeadModal(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    toast({
      title: "Success",
      description: "Lead updated successfully",
    });
  };

  const handleConvertLead = (leadId: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, status: "converted" } : lead
      )
    );
    toast({
      title: "Success",
      description: "Lead converted to client!",
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchTermLower) ||
      lead.email.toLowerCase().includes(searchTermLower) ||
      lead.phone.toLowerCase().includes(searchTermLower) ||
      lead.address.toLowerCase().includes(searchTermLower) ||
      lead.service.toLowerCase().includes(searchTermLower) ||
      lead.source.toLowerCase().includes(searchTermLower)
    );
  });

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Leads
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your leads and track their progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddLeadModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden md:inline">{formatDateRange()}</span>
              <span className="md:hidden">Date Range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              selected={dateRange as any}
              onSelect={setDateRange as any}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <LeadsTable
        leads={filteredLeads}
        onEditLead={(lead) => {
          setSelectedLead(lead);
          setShowEditLeadModal(true);
        }}
        onViewDetails={(lead) => setActiveLeadDetailsDialog(lead.id)}
      />

      <Dialog open={activeLeadDetailsDialog !== null} onOpenChange={() => setActiveLeadDetailsDialog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" /> Lead Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                  <p>{selectedLead.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <Badge variant={selectedLead.status === "converted" ? "outline" : selectedLead.status === "active" ? "secondary" : "destructive"}>
                    {selectedLead.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                  <p>{selectedLead.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Source</h3>
                  <p>{selectedLead.source}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date Added</h3>
                  <p>{format(selectedLead.dateAdded, "MMM d, yyyy")}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Service</h3>
                  <p>{selectedLead.service}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Value</h3>
                  <p>${selectedLead.value}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                <p>{selectedLead.address}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="text-sm">{selectedLead.notes || "No notes available"}</p>
              </div>
              
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveLeadDetailsDialog(null);
                      handleEditLead(selectedLead);
                    }}
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit Lead
                  </Button>
                  
                  {selectedLead.status !== "converted" && (
                    <Button
                      onClick={() => {
                        setActiveLeadDetailsDialog(null);
                        handleConvertLead(selectedLead.id);
                      }}
                    >
                      <CheckSquareIcon className="mr-2 h-4 w-4" />
                      Convert to Client
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddLeadModal
        open={showAddLeadModal}
        onOpenChange={setShowAddLeadModal}
        onAddLead={handleAddLead}
      />

      <EditLeadModal
        open={showEditLeadModal}
        onOpenChange={setShowEditLeadModal}
        onUpdateLead={handleUpdateLead}
        lead={selectedLead}
      />
    </div>
  );
};

export default Leads;
