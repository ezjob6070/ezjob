
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateJobFormData, Job, JobPriority } from "./JobTypes";
import * as z from "zod";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  clientName: z.string().min(1, "Client name is required"),
  technicianId: z.string().min(1, "Technician is required"),
  amount: z.coerce.number().min(0, "Amount must be at least 0"),
  date: z.date(),
  time: z.date().optional(),
  isAllDay: z.boolean().default(false),
  priority: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  serviceType: z.string().optional(),
  jobSourceId: z.string().optional(),
  contractorId: z.string().optional(),
});

interface CreateJobModalProps {
  onAddJob: (job: Job) => void;
  technicians: { id: string; name: string; paymentType?: string; paymentRate?: number }[];
  jobSources: { id: string; name: string; paymentType?: string; paymentValue?: number }[];
  contractors?: { id: string; name: string; paymentType?: string; paymentRate?: number }[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateJobModal = ({
  onAddJob,
  technicians = [],
  jobSources = [],
  contractors = [],
  open = false,
  onOpenChange = () => {},
}: CreateJobModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<JobPriority>("medium");
  const [categories] = useState([
    "HVAC",
    "Plumbing",
    "Electrical",
    "Remodeling",
    "Security",
    "Smart Home",
    "Renewable Energy",
    "Landscape",
    "Interior Design"
  ]);
  
  const [serviceTypes, setServiceTypes] = useState<Record<string, string[]>>({
    "HVAC": ["Installation", "Repair", "Maintenance", "Cleaning"],
    "Plumbing": ["Installation", "Repair", "Maintenance", "Drain Cleaning"],
    "Electrical": ["Installation", "Repair", "Maintenance", "Inspection"],
    "Remodeling": ["Kitchen", "Bathroom", "Whole House", "Addition"],
    "Security": ["Cameras", "Alarms", "Access Control", "Monitoring"],
    "Smart Home": ["Installation", "Integration", "Troubleshooting"],
    "Renewable Energy": ["Solar Panel Installation", "Battery Backup", "Consultation"],
    "Landscape": ["Design", "Installation", "Maintenance", "Irrigation"],
    "Interior Design": ["Consultation", "Full Service", "Material Selection"]
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      clientName: "",
      technicianId: "",
      amount: 0,
      date: new Date(),
      isAllDay: false,
      priority: "medium",
      description: "",
      category: undefined,
      serviceType: undefined,
      jobSourceId: undefined,
      contractorId: undefined,
    },
  });
  
  const selectedCategory = form.watch("category");
  
  // Filter service types based on selected category
  const availableServiceTypes = selectedCategory ? serviceTypes[selectedCategory] || [] : [];
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newJob: Job = {
      id: uuidv4(),
      title: values.title,
      clientName: values.clientName,
      amount: values.amount,
      status: "scheduled",
      date: values.date.toISOString(),
      scheduledDate: values.date.toISOString(),
      technicianId: values.technicianId,
      technicianName: technicians.find(tech => tech.id === values.technicianId)?.name || "",
      priority: values.priority as JobPriority,
      description: values.description || "",
      isAllDay: values.isAllDay,
      category: values.category,
      serviceType: values.serviceType,
      jobSourceId: values.jobSourceId,
      jobSourceName: jobSources.find(source => source.id === values.jobSourceId)?.name || "",
      contractorId: values.contractorId,
      contractorName: contractors?.find(contractor => contractor.id === values.contractorId)?.name || "",
    };
    
    onAddJob(newJob);
    form.reset();
    onOpenChange(false);
    toast({
      title: "Job created",
      description: `New job "${values.title}" has been created.`,
    });
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new job.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a technician" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setSelectedDate(date);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="isAllDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>All Day Event</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsAllDay(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {!form.watch("isAllDay") && (
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(selectedDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                              setSelectedTime(newDate);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedCategory}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableServiceTypes.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobSourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {contractors && contractors.length > 0 && (
              <FormField
                control={form.control}
                name="contractorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contractor (optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contractor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contractors.map((contractor) => (
                          <SelectItem key={contractor.id} value={contractor.id}>
                            {contractor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Job</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
