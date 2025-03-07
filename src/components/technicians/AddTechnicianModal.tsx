
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Technician } from "@/pages/Technicians";
import { useToast } from "@/components/ui/use-toast";

type AddTechnicianModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTechnician: (technician: Technician) => void;
};

const SPECIALTIES = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "General Maintenance",
  "Security Systems",
  "Painting",
  "Flooring",
  "Roofing",
  "Landscaping",
];

const AddTechnicianModal = ({ open, onOpenChange, onAddTechnician }: AddTechnicianModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    paymentType: "percentage",
    paymentRate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.specialty) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate random ID and initials
    const id = `tech-${Date.now()}`;
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // Create new technician object
    const newTechnician: Technician = {
      ...formData,
      id,
      initials,
      status: "active",
      paymentType: formData.paymentType as "percentage" | "flat",
      paymentRate: parseFloat(formData.paymentRate),
      completedJobs: 0,
      totalRevenue: 0,
      rating: 5.0, // Default 5-star rating for new technicians
    };

    onAddTechnician(newTechnician);
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      paymentType: "percentage",
      paymentRate: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Technician</DialogTitle>
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
                placeholder="John Smith"
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
              <Label htmlFor="specialty">Specialty *</Label>
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>Select specialty</option>
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label className="mb-2 block">Payment Structure *</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="percentage"
                    name="paymentType"
                    value="percentage"
                    checked={formData.paymentType === "percentage"}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="percentage" className="cursor-pointer">Percentage (%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="flat"
                    name="paymentType"
                    value="flat"
                    checked={formData.paymentType === "flat"}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="flat" className="cursor-pointer">Flat Rate ($)</Label>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paymentRate">
                {formData.paymentType === "percentage" ? "Percentage Rate (%)" : "Flat Rate ($)"}
              </Label>
              <Input
                id="paymentRate"
                name="paymentRate"
                type="number"
                value={formData.paymentRate}
                onChange={handleChange}
                placeholder={formData.paymentType === "percentage" ? "20" : "100"}
                min="0"
                step={formData.paymentType === "percentage" ? "1" : "0.01"}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Technician</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnicianModal;
