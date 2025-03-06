
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type AddClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClient: (client: any) => void;
};

const AddClientModal = ({ open, onOpenChange, onAddClient }: AddClientModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    paymentStatus: "current", // Possible values: 'current', 'overdue', 'pending'
    paymentAmount: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate random ID and initials
    const id = Math.random().toString(36).substring(2, 10);
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // Create new client object
    const newClient = {
      ...formData,
      id,
      initials,
      status: "active",
      paymentAmount: parseFloat(formData.paymentAmount),
      createdAt: new Date(),
      lastContact: new Date(),
    };

    onAddClient(newClient);
    
    // Reset form and close modal
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      paymentStatus: "current",
      paymentAmount: "0",
    });
    
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "New client added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
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
              <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
              <Input
                id="paymentAmount"
                name="paymentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.paymentAmount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="current">Current</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
