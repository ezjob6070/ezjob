
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Technician } from "@/types/technician";
import { toast } from "sonner";

interface AddContractorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contractor: Technician) => void;
}

const DEFAULT_SUB_ROLES = ["Independent", "Agency", "Specialized", "Consultant"];

const AddContractorModal: React.FC<AddContractorModalProps> = ({ open, onOpenChange, onSave }) => {
  const [hireDate, setHireDate] = useState<Date | undefined>(new Date());
  const [contractor, setContractor] = useState<Partial<Technician>>({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    address: "",
    status: "active",
    paymentType: "hourly",
    paymentRate: 0,
    hourlyRate: 0,
    role: "contractor",
    subRole: "Independent",
    skills: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContractor(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setContractor(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value.split(",").map(skill => skill.trim()).filter(Boolean);
    setContractor(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = () => {
    // Form validation
    if (!contractor.name || !contractor.email || !contractor.specialty) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create the contractor with all required fields
    const newContractor: Technician = {
      id: uuidv4(),
      name: contractor.name!,
      email: contractor.email!,
      phone: contractor.phone || "",
      specialty: contractor.specialty!,
      hireDate: hireDate ? format(hireDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      status: contractor.status as "active" | "inactive" | "onLeave",
      paymentType: contractor.paymentType as any,
      paymentRate: Number(contractor.paymentRate) || 0,
      hourlyRate: Number(contractor.hourlyRate) || 0,
      role: "contractor",
      subRole: contractor.subRole,
      skills: contractor.skills || [],
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      initials: contractor.name!.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    onSave(newContractor);
    toast.success("Contractor added successfully!");
    onOpenChange(false);
    
    // Reset form
    setContractor({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      address: "",
      status: "active",
      paymentType: "hourly",
      paymentRate: 0,
      hourlyRate: 0,
      role: "contractor",
      subRole: "Independent",
      skills: []
    });
    setHireDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contractor</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="required">Name</Label>
            <Input
              id="name"
              name="name"
              value={contractor.name || ""}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="required">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contractor.email || ""}
              onChange={handleInputChange}
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={contractor.phone || ""}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty" className="required">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              value={contractor.specialty || ""}
              onChange={handleInputChange}
              placeholder="Main specialty or service"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Contractor Type</Label>
            <Select 
              value={contractor.subRole} 
              onValueChange={(value) => handleSelectChange("subRole", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contractor type" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_SUB_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={contractor.status} 
              onValueChange={(value) => handleSelectChange("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="onLeave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Type</Label>
            <Select 
              value={contractor.paymentType} 
              onValueChange={(value) => handleSelectChange("paymentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
                <SelectItem value="flat">Flat Rate</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Rate ($)</Label>
            <Input
              name="paymentRate"
              type="number"
              min="0"
              step="0.01"
              value={contractor.paymentRate || ""}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !hireDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {hireDate ? format(hireDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={hireDate}
                  onSelect={setHireDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Hourly Rate (Used for calculations)</Label>
            <Input
              name="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={contractor.hourlyRate || ""}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={contractor.address || ""}
              onChange={handleInputChange}
              placeholder="Enter address"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label>Skills (comma separated)</Label>
            <Textarea
              placeholder="Skill 1, Skill 2, Skill 3..."
              onChange={handleSkillsChange}
              value={contractor.skills?.join(", ") || ""}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Contractor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContractorModal;
