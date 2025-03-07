import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { Job, JobStatus } from "@/components/jobs/JobTypes";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: Job) => void;
}

const CreateJobModal = ({ open, onOpenChange, onAddJob }: CreateJobModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");
  const [client, setClient] = useState({ id: "", name: "" });
  const [technician, setTechnician] = useState({ id: "", name: "" });
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<JobStatus>("scheduled");

  const clients = [
    { id: "client1", name: "Acme Corp" },
    { id: "client2", name: "Tech Solutions Inc." },
    { id: "client3", name: "Global Industries" },
  ];

  const technicians = [
    { id: "tech1", name: "John Smith" },
    { id: "tech2", name: "Sarah Johnson" },
    { id: "tech3", name: "Michael Brown" },
  ];

  const handleSubmit = () => {
    if (!title || !client.id || !technician.id || !amount || !date) {
      return;
    }

    const newJob: Job = {
      id: uuidv4(),
      title,
      clientName: client.name,
      clientId: client.id,
      technicianName: technician.name,
      technicianId: technician.id,
      scheduledDate: date,
      status,
      amount: parseFloat(amount),
      description,
      createdAt: new Date(),
    };

    onAddJob(newJob);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setClient({ id: "", name: "" });
    setTechnician({ id: "", name: "" });
    setDate(new Date());
    setAmount("");
    setDescription("");
    setStatus("scheduled");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Add a new job to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Select 
              onValueChange={(value) => {
                const selectedClient = clients.find(c => c.id === value);
                if (selectedClient) {
                  setClient(selectedClient);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="technician">Technician</Label>
            <Select 
              onValueChange={(value) => {
                const selectedTechnician = technicians.find(t => t.id === value);
                if (selectedTechnician) {
                  setTechnician(selectedTechnician);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue="scheduled"
              onValueChange={(value) => setStatus(value as JobStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter job description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
