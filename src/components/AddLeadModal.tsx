
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { type Lead, type LeadStatus } from "@/pages/Leads";

type AddLeadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Lead) => void;
};

const statusOptions: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost"
];

const sourceOptions = [
  "website",
  "referral",
  "social",
  "email",
  "other"
];

const assigneeOptions = [
  "Sarah Miller",
  "Alex Johnson",
  "Michael Williams",
  "Emily Davis"
];

const AddLeadModal = ({ open, onOpenChange, onAddLead }: AddLeadModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "new" as LeadStatus,
    source: "website",
    value: "0",
    assignedTo: "Sarah Miller", // Default assignee
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.company || !formData.email) {
      toast({
        title: "Error",
        description: "Name, company, and email are required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate random ID
    const id = Math.random().toString(36).substring(2, 10);

    // Create new lead object
    const newLead: Lead = {
      ...formData,
      id,
      value: parseFloat(formData.value) || 0,
      createdAt: new Date(),
      lastContact: new Date(),
      nextFollowUp: new Date(new Date().setDate(new Date().getDate() + 3)), // Default follow-up in 3 days
    };

    onAddLead(newLead);
    
    // Reset form and close modal
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "new",
      source: "website",
      value: "0",
      assignedTo: "Sarah Miller",
      notes: ""
    });
    
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "New lead added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                name="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {assigneeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {sourceOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this lead..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
