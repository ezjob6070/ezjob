import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Technician } from "@/types/technician";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, FileImage, Upload, DollarSign, Clock, Calendar } from "lucide-react";
import { SalaryBasis, IncentiveType } from "@/types/employee";

type EditTechnicianModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTechnician: (updatedTechnician: Technician) => void;
  technician: Technician | null;
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

const EditTechnicianModal = ({ open, onOpenChange, onUpdateTechnician, technician }: EditTechnicianModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Technician>>({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    address: "",
    status: "active",
    paymentType: "percentage",
    paymentRate: 0,
    notes: "",
    imageUrl: "",
    // New salary fields
    salaryBasis: SalaryBasis.HOURLY,
    hourlyRate: 0,
    incentiveType: IncentiveType.HOURLY,
    incentiveAmount: 0,
  });
  
  // For image handling
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Update form data when technician changes
  useEffect(() => {
    if (technician) {
      setFormData({
        name: technician.name,
        email: technician.email,
        phone: technician.phone || "",
        specialty: technician.specialty,
        address: technician.address || "",
        status: technician.status,
        paymentType: technician.paymentType,
        paymentRate: technician.paymentRate,
        notes: technician.notes || "",
        imageUrl: technician.imageUrl || "",
        // New salary fields
        salaryBasis: technician.salaryBasis || SalaryBasis.HOURLY,
        hourlyRate: technician.hourlyRate || 0,
        incentiveType: technician.incentiveType || IncentiveType.HOURLY,
        incentiveAmount: technician.incentiveAmount || 0,
      });
      
      // Set preview if image exists
      if (technician.imageUrl) {
        setPreviewUrl(technician.imageUrl);
      } else {
        setPreviewUrl("");
      }
    }
  }, [technician]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create object URL for preview
      const fileUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(fileUrl);
      
      // In a real app, you would upload to server here
      // For this demo, we'll just use the URL directly
      setFormData(prev => ({ ...prev, imageUrl: fileUrl }));
    }
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

    if (!technician) return;

    // Create updated technician object
    const updatedTechnician: Technician = {
      ...technician,
      ...formData,
      paymentRate: typeof formData.paymentRate === 'string' 
        ? parseFloat(formData.paymentRate) 
        : formData.paymentRate || 0,
      paymentType: formData.paymentType as "percentage" | "flat",
      status: formData.status as "active" | "inactive",
      imageUrl: formData.imageUrl || undefined,
      // New salary fields
      salaryBasis: formData.salaryBasis as SalaryBasis,
      hourlyRate: typeof formData.hourlyRate === 'string'
        ? parseFloat(formData.hourlyRate)
        : formData.hourlyRate || 0,
      incentiveType: formData.incentiveType as IncentiveType,
      incentiveAmount: typeof formData.incentiveAmount === 'string'
        ? parseFloat(formData.incentiveAmount)
        : formData.incentiveAmount || 0,
    };

    onUpdateTechnician(updatedTechnician);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Technician</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Image upload section */}
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex flex-col items-center">
              <div className="mb-3">
                {previewUrl ? (
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={previewUrl} alt={formData.name || "Profile"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                      {technician?.initials || ""}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                      {technician?.initials || ""}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              
              <div className="flex gap-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </div>
                  <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </label>
                
                {previewUrl && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setPreviewUrl("");
                      setSelectedImage(null);
                      setFormData(prev => ({ ...prev, imageUrl: "" }));
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
          
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
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

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Salary Settings Section */}
            <div className="bg-slate-50 p-4 rounded-md mt-4 border">
              <h3 className="font-medium text-md flex items-center mb-3">
                <DollarSign className="h-4 w-4 mr-1" />
                Salary Settings
              </h3>
              
              <div className="grid gap-2 mb-3">
                <Label htmlFor="salaryBasis">Salary Basis *</Label>
                <select
                  id="salaryBasis"
                  name="salaryBasis"
                  value={formData.salaryBasis}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value={SalaryBasis.HOURLY}>Hourly</option>
                  <option value={SalaryBasis.WEEKLY}>Weekly</option>
                  <option value={SalaryBasis.MONTHLY}>Monthly</option>
                  <option value={SalaryBasis.YEARLY}>Yearly</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hourlyRate" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Hourly Rate ($)
                  </Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    placeholder="25.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                {formData.salaryBasis !== SalaryBasis.HOURLY && (
                  <div className="grid gap-2">
                    <Label htmlFor="salary" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formData.salaryBasis === SalaryBasis.WEEKLY 
                        ? "Weekly Salary ($)" 
                        : formData.salaryBasis === SalaryBasis.MONTHLY 
                          ? "Monthly Salary ($)" 
                          : "Yearly Salary ($)"}
                    </Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                )}
              </div>
              
              <h4 className="font-medium text-sm mt-4 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Incentive Options
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="incentiveType">Incentive Type</Label>
                  <select
                    id="incentiveType"
                    name="incentiveType"
                    value={formData.incentiveType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value={IncentiveType.HOURLY}>Per Hour</option>
                    <option value={IncentiveType.WEEKLY}>Per Week</option>
                    <option value={IncentiveType.MONTHLY}>Per Month</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="incentiveAmount">Incentive Amount ($)</Label>
                  <Input
                    id="incentiveAmount"
                    name="incentiveAmount"
                    type="number"
                    value={formData.incentiveAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
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

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional information about this technician..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Technician</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTechnicianModal;
