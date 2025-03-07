
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface EditLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLead: (lead: Lead) => void;
  lead: Lead | null;
}

const services = ["Plumbing", "HVAC", "Electrical", "General Contracting", "Remodeling", "Other"];
const sources = ["Website", "Referral", "Google Ads", "Facebook", "Direct Mail", "Other"];
const statuses = ["active", "converted", "inactive"];

const EditLeadModal = ({ open, onOpenChange, onUpdateLead, lead }: EditLeadModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState(services[0]);
  const [source, setSource] = useState(sources[0]);
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState<"active" | "converted" | "inactive">("active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email);
      setPhone(lead.phone);
      setAddress(lead.address);
      setService(lead.service);
      setSource(lead.source);
      setValue(lead.value.toString());
      setStatus(lead.status);
      setNotes(lead.notes || "");
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;
    
    const updatedLead: Lead = {
      ...lead,
      name,
      email,
      phone,
      address,
      service,
      source,
      value: parseFloat(value) || 0,
      status,
      notes: notes.trim() || undefined
    };
    
    onUpdateLead(updatedLead);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {lead && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Estimated Value ($)</Label>
                  <Input 
                    id="value" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value as "active" | "converted" | "inactive")}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === 'active' ? 'Active' : 
                          option === 'converted' ? 'Converted' : 'Inactive'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Update Lead</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadModal;
