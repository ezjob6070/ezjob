
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Lead, LEAD_SERVICES, LEAD_SOURCES } from "@/types/lead";

interface AddLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Lead) => void;
}

const initialStatuses = ["new", "contacted", "qualified", "proposal", "active"];

const AddLeadModal = ({ open, onOpenChange, onAddLead }: AddLeadModalProps) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [service, setService] = useState("");
  const [source, setSource] = useState("");
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [estimatedClosingDate, setEstimatedClosingDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: Lead = {
      id: uuidv4(),
      name,
      company,
      email,
      phone,
      address,
      service,
      source,
      value: parseFloat(value) || 0,
      createdAt: new Date(),
      status: status as Lead['status'],
      notes: notes.trim() || undefined,
      estimatedClosingDate,
      priority
    };
    
    onAddLead(newLead);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setAddress("");
    setService("");
    setSource("");
    setValue("0");
    setStatus("new");
    setNotes("");
    setEstimatedClosingDate(undefined);
    setPriority("medium");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
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
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SERVICES.map((option) => (
                      <SelectItem key={option} value={option || "unknown"}>
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
                    {LEAD_SOURCES.map((option) => (
                      <SelectItem key={option} value={option || "unknown"}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialStatuses.map((status) => (
                      <SelectItem key={status} value={status || "new"}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Estimated Closing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !estimatedClosingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {estimatedClosingDate ? format(estimatedClosingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={estimatedClosingDate}
                      onSelect={setEstimatedClosingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
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
            <Button type="submit">Add Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
