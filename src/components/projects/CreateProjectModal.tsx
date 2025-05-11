
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { technicians as techniciansList } from "@/data/technicians";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: Project) => void;
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

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    // Default end date is 3 months from now
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date;
  });

  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedSalesmen, setSelectedSalesmen] = useState<string[]>([]);

  // Filter technicians by role
  const availableContractors = techniciansList.filter(tech => 
    tech.role === "contractor" || tech.paymentType === "flat" || tech.paymentType === "hourly"
  );
  
  const availableSalesmen = techniciansList.filter(tech => 
    tech.role === "salesman" || tech.incentiveType === "commission"
  );

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

  const toggleContractor = (contractorId: string) => {
    setSelectedContractors(prev => 
      prev.includes(contractorId) 
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    );
  };

  const toggleSalesman = (salesmanId: string) => {
    setSelectedSalesmen(prev => 
      prev.includes(salesmanId) 
        ? prev.filter(id => id !== salesmanId)
        : [...prev, salesmanId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format contractors
    const formattedContractors: ProjectContractor[] = selectedContractors.map(id => {
      const contractor = availableContractors.find(c => c.id === id);
      if (!contractor) return {} as ProjectContractor;
      
      return {
        id: contractor.id,
        name: contractor.name,
        role: contractor.subRole || contractor.specialty || "General Contractor",
        rate: contractor.payRate || contractor.hourlyRate || 0,
        rateType: contractor.paymentType === "hourly" ? "hourly" : 
                 contractor.paymentType === "flat" ? "fixed" : "daily",
        totalPaid: 0,
        startDate: format(startDate, 'yyyy-MM-dd'),
        status: "active",
      };
    });

    // Format salesmen
    const formattedSalesmen: ProjectSalesperson[] = selectedSalesmen.map(id => {
      const salesman = availableSalesmen.find(s => s.id === id);
      if (!salesman) return {} as ProjectSalesperson;
      
      return {
        id: salesman.id,
        name: salesman.name,
        commission: salesman.incentiveAmount || 5,
        commissionType: salesman.paymentType === "percentage" ? "percentage" : "fixed",
        totalSales: 0,
        totalCommission: 0,
      };
    });
    
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
      ...formData,
      completion: 0,
      workers: selectedContractors.length,
      vehicles: 0,
      startDate: format(startDate, 'yyyy-MM-dd'),
      expectedEndDate: format(endDate, 'yyyy-MM-dd'),
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
    setStartDate(new Date());
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + 3);
    setEndDate(newEndDate);
    setSelectedContractors([]);
    setSelectedSalesmen([]);
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

            {/* Project Timeline Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Expected End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      disabled={(date) => date < startDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contractors section */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Assign Contractors</h3>
              {selectedContractors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedContractors.map(id => {
                    const contractor = availableContractors.find(c => c.id === id);
                    return contractor && (
                      <Badge 
                        key={id} 
                        variant="secondary" 
                        className="flex items-center gap-1 py-1 px-2"
                        onClick={() => toggleContractor(id)}
                      >
                        {contractor.name}
                        <span className="text-xs ml-2 cursor-pointer hover:text-red-500">✕</span>
                      </Badge>
                    );
                  })}
                </div>
              )}
              
              <Select onValueChange={toggleContractor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent>
                  {availableContractors.map(contractor => (
                    <SelectItem 
                      key={contractor.id} 
                      value={contractor.id}
                      disabled={selectedContractors.includes(contractor.id)}
                    >
                      {contractor.name} ({contractor.specialty || contractor.subRole || "Contractor"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableContractors.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">No contractors available in the system.</p>
              )}
            </div>

            {/* Salesmen section */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Assign Salesmen</h3>
              {selectedSalesmen.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSalesmen.map(id => {
                    const salesman = availableSalesmen.find(s => s.id === id);
                    return salesman && (
                      <Badge 
                        key={id} 
                        variant="secondary" 
                        className="flex items-center gap-1 py-1 px-2"
                        onClick={() => toggleSalesman(id)}
                      >
                        {salesman.name}
                        <span className="text-xs ml-2 cursor-pointer hover:text-red-500">✕</span>
                      </Badge>
                    );
                  })}
                </div>
              )}
              
              <Select onValueChange={toggleSalesman}>
                <SelectTrigger>
                  <SelectValue placeholder="Select salesman" />
                </SelectTrigger>
                <SelectContent>
                  {availableSalesmen.map(salesman => (
                    <SelectItem 
                      key={salesman.id} 
                      value={salesman.id}
                      disabled={selectedSalesmen.includes(salesman.id)}
                    >
                      {salesman.name} ({salesman.subRole || "Sales"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableSalesmen.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">No salesmen available in the system.</p>
              )}
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
