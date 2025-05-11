
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Project, ProjectContractor, ProjectSalesperson } from "@/types/project";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: Project) => void;
}

interface ContractorInput {
  name: string;
  role: string;
  rate: number;
  rateType: "hourly" | "fixed" | "daily";
}

interface SalesmanInput {
  name: string;
  commission: number;
  commissionType: "fixed" | "percentage";
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onAddProject
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    clientName: "",
    budget: 0,
    status: "Not Started" as Project["status"]
  });

  const [contractors, setContractors] = useState<ContractorInput[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanInput[]>([]);
  const [newContractor, setNewContractor] = useState<ContractorInput>({
    name: "",
    role: "",
    rate: 0,
    rateType: "hourly"
  });
  const [newSalesman, setNewSalesman] = useState<SalesmanInput>({
    name: "",
    commission: 0,
    commissionType: "percentage"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContractorChange = (field: keyof ContractorInput, value: string | number) => {
    setNewContractor(prev => ({
      ...prev,
      [field]: field === "rate" ? parseFloat(value as string) || 0 : value
    }));
  };

  const handleSalesmanChange = (field: keyof SalesmanInput, value: string | number) => {
    setNewSalesman(prev => ({
      ...prev,
      [field]: field === "commission" ? parseFloat(value as string) || 0 : value
    }));
  };

  const addContractor = () => {
    if (newContractor.name && newContractor.role) {
      setContractors([...contractors, { ...newContractor }]);
      setNewContractor({
        name: "",
        role: "",
        rate: 0,
        rateType: "hourly"
      });
    }
  };

  const addSalesman = () => {
    if (newSalesman.name) {
      setSalesmen([...salesmen, { ...newSalesman }]);
      setNewSalesman({
        name: "",
        commission: 0,
        commissionType: "percentage"
      });
    }
  };

  const removeContractor = (index: number) => {
    setContractors(contractors.filter((_, i) => i !== index));
  };

  const removeSalesman = (index: number) => {
    setSalesmen(salesmen.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 6); // Default project duration: 6 months
    
    const formattedContractors: ProjectContractor[] = contractors.map(c => ({
      id: uuidv4(),
      name: c.name,
      role: c.role,
      rate: c.rate,
      rateType: c.rateType,
      totalPaid: 0,
      startDate: today.toISOString().split("T")[0],
      status: "active",
    }));

    const formattedSalesmen: ProjectSalesperson[] = salesmen.map(s => ({
      id: uuidv4(),
      name: s.name,
      commission: s.commission,
      commissionType: s.commissionType,
      totalSales: 0,
      totalCommission: 0,
    }));
    
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
      ...formData,
      completion: 0,
      workers: 0,
      vehicles: 0,
      startDate: today.toISOString().split("T")[0],
      expectedEndDate: endDate.toISOString().split("T")[0],
      actualSpent: 0,
      contractors: formattedContractors,
      salesmen: formattedSalesmen
    };
    
    onAddProject(newProject);
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      location: "",
      clientName: "",
      budget: 0,
      status: "Not Started"
    });
    setContractors([]);
    setSalesmen([]);
    setNewContractor({
      name: "",
      role: "",
      rate: 0,
      rateType: "hourly"
    });
    setNewSalesman({
      name: "",
      commission: 0,
      commissionType: "percentage"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details to create a new project in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Project Type *
                </label>
                <Input
                  id="type"
                  name="type"
                  placeholder="Residential, Commercial, etc."
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the project"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="clientName" className="text-sm font-medium">
                  Client Name *
                </label>
                <Input
                  id="clientName"
                  name="clientName"
                  placeholder="Client name or company"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    placeholder="0.00"
                    value={formData.budget || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                placeholder="Project location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Contractors section */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Contractors</h3>
              <div className="space-y-4">
                {contractors.map((contractor, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium">{contractor.name}</div>
                      <div className="text-sm text-gray-500">
                        {contractor.role} - ${contractor.rate}/{contractor.rateType}
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeContractor(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="contractor-name">Contractor Name</Label>
                    <Input
                      id="contractor-name"
                      placeholder="Enter name"
                      value={newContractor.name}
                      onChange={(e) => handleContractorChange("name", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contractor-role">Role</Label>
                    <Input
                      id="contractor-role"
                      placeholder="e.g. Electrician, Plumber"
                      value={newContractor.role}
                      onChange={(e) => handleContractorChange("role", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="contractor-rate">Rate</Label>
                    <Input
                      id="contractor-rate"
                      type="number"
                      placeholder="0.00"
                      value={newContractor.rate || ""}
                      onChange={(e) => handleContractorChange("rate", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contractor-rate-type">Rate Type</Label>
                    <Select
                      value={newContractor.rateType}
                      onValueChange={(value) => handleContractorChange("rateType", value as "hourly" | "fixed" | "daily")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addContractor}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Contractor
                </Button>
              </div>
            </div>

            {/* Salesmen section */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Salesmen</h3>
              <div className="space-y-4">
                {salesmen.map((salesman, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium">{salesman.name}</div>
                      <div className="text-sm text-gray-500">
                        {salesman.commission}{salesman.commissionType === "percentage" ? "%" : "$"} Commission
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSalesman(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="salesman-name">Salesman Name</Label>
                    <Input
                      id="salesman-name"
                      placeholder="Enter name"
                      value={newSalesman.name}
                      onChange={(e) => handleSalesmanChange("name", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="salesman-commission">Commission</Label>
                      <Input
                        id="salesman-commission"
                        type="number"
                        placeholder={newSalesman.commissionType === "percentage" ? "%" : "$"}
                        value={newSalesman.commission || ""}
                        onChange={(e) => handleSalesmanChange("commission", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salesman-commission-type">Commission Type</Label>
                      <Select
                        value={newSalesman.commissionType}
                        onValueChange={(value) => handleSalesmanChange("commissionType", value as "percentage" | "fixed")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addSalesman}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Salesman
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
