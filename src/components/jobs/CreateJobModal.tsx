
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Job, JobStatus } from "@/pages/Jobs";
import { calculateTechnicianProfit, calculateCompanyProfit } from "@/components/dashboard/DashboardUtils";

type CreateJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: Job) => void;
};

// Mock data for the dropdown selects
const CLIENTS = [
  { id: "client1", name: "Acme Corp" },
  { id: "client2", name: "Tech Solutions Inc." },
  { id: "client3", name: "Global Industries" },
  { id: "client4", name: "Innovative Designs" },
];

const TECHNICIANS = [
  { id: "tech1", name: "John Smith", rate: 20, isPercentage: true },
  { id: "tech2", name: "Sarah Johnson", rate: 25, isPercentage: true },
  { id: "tech3", name: "Michael Brown", rate: 100, isPercentage: false },
  { id: "tech4", name: "Emily Davis", rate: 15, isPercentage: true },
];

const CreateJobModal = ({ open, onOpenChange, onAddJob }: CreateJobModalProps) => {
  const [jobData, setJobData] = useState({
    title: "",
    clientId: "",
    technicianId: "",
    scheduledDate: "",
    amount: "",
    description: "",
    isPercentageRate: true,
    technicianRate: 0,
  });

  const [selectedTechnician, setSelectedTechnician] = useState<{
    id: string;
    name: string;
    rate: number;
    isPercentage: boolean;
  } | null>(null);

  const [profitCalculation, setProfitCalculation] = useState({
    totalAmount: 0,
    technicianProfit: 0,
    companyProfit: 0,
  });

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = CLIENTS.find(c => c.id === clientId);
    
    setJobData(prev => ({
      ...prev,
      clientId: clientId,
      clientName: client?.name || "",
    }));
  };

  const handleTechnicianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const techId = e.target.value;
    const technician = TECHNICIANS.find(t => t.id === techId);
    
    if (technician) {
      setSelectedTechnician(technician);
      setJobData(prev => ({
        ...prev,
        technicianId: techId,
        technicianName: technician.name,
        isPercentageRate: technician.isPercentage,
        technicianRate: technician.rate,
      }));

      // Update profit calculation
      if (jobData.amount) {
        const amount = parseFloat(jobData.amount);
        const techProfit = calculateTechnicianProfit(amount, technician.rate, technician.isPercentage);
        const companyProfit = calculateCompanyProfit(amount, techProfit);
        
        setProfitCalculation({
          totalAmount: amount,
          technicianProfit: techProfit,
          companyProfit: companyProfit,
        });
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setJobData(prev => ({ ...prev, amount }));
    
    // Update profit calculation if we have a technician selected
    if (selectedTechnician && amount) {
      const amountNum = parseFloat(amount);
      const techProfit = calculateTechnicianProfit(
        amountNum, 
        selectedTechnician.rate, 
        selectedTechnician.isPercentage
      );
      const companyProfit = calculateCompanyProfit(amountNum, techProfit);
      
      setProfitCalculation({
        totalAmount: amountNum,
        technicianProfit: techProfit,
        companyProfit: companyProfit,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find selected client and technician
    const client = CLIENTS.find(c => c.id === jobData.clientId);
    const technician = TECHNICIANS.find(t => t.id === jobData.technicianId);
    
    if (!client || !technician) {
      return; // Should not happen with proper validation
    }
    
    // Create new job object
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title,
      clientName: client.name,
      clientId: client.id,
      technicianName: technician.name,
      technicianId: technician.id,
      scheduledDate: new Date(jobData.scheduledDate),
      status: "scheduled" as JobStatus,
      amount: parseFloat(jobData.amount),
      description: jobData.description,
      createdAt: new Date(),
    };
    
    onAddJob(newJob);
    
    // Reset form and close modal
    setJobData({
      title: "",
      clientId: "",
      technicianId: "",
      scheduledDate: "",
      amount: "",
      description: "",
      isPercentageRate: true,
      technicianRate: 0,
    });
    setSelectedTechnician(null);
    setProfitCalculation({
      totalAmount: 0,
      technicianProfit: 0,
      companyProfit: 0,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="HVAC Maintenance"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client *</Label>
              <select
                id="clientId"
                name="clientId"
                value={jobData.clientId}
                onChange={handleClientChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>Select a client</option>
                {CLIENTS.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="technicianId">Technician *</Label>
              <select
                id="technicianId"
                name="technicianId"
                value={jobData.technicianId}
                onChange={handleTechnicianChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>Select a technician</option>
                {TECHNICIANS.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.isPercentage ? `${tech.rate}%` : `$${tech.rate} flat`})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={jobData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Job Amount ($) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={jobData.amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                required
              />
            </div>
            
            {jobData.amount && selectedTechnician && (
              <div className="grid gap-2 border p-4 rounded-md bg-gray-50">
                <h3 className="text-sm font-medium">Profit Calculation</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">${profitCalculation.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Technician ({selectedTechnician.isPercentage ? `${selectedTechnician.rate}%` : `$${selectedTechnician.rate} flat`})</p>
                    <p className="font-medium">${profitCalculation.technicianProfit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company Profit</p>
                    <p className="font-medium">${profitCalculation.companyProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the job details..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
