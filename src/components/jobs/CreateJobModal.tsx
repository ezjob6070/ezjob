import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon, Clock, ImageIcon, FileSignature, Send, Percent, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Job, JobStatus } from "./JobTypes";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { JobSource } from "@/types/jobSource";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: Job) => void;
  technicians: { id: string; name: string; paymentType?: string; paymentRate?: number }[];
  jobSources?: { id: string; name: string; paymentType?: string; paymentValue?: number }[];
  contractors?: { id: string; name: string; paymentType?: string; paymentRate?: number }[];
}

const timeOptions = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM"
];

const formSchema = z.object({
  title: z.string().optional(),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  clientAddress: z.string().min(5, "Address must be at least 5 characters"),
  technicianId: z.string().min(1, "Please select a technician"),
  contractorId: z.string().optional(),
  jobSourceId: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSelection: z.enum(["preset", "custom", "allDay"]).default("preset"),
  presetTime: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  amount: z.coerce.number().optional(),
  notes: z.string().optional(),
  parts: z.string().optional(),
  hasSignature: z.boolean().default(false),
  sendNotification: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  open,
  onOpenChange,
  onAddJob,
  technicians,
  jobSources = [],
  contractors = [],
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      clientAddress: "",
      technicianId: "",
      contractorId: "",
      jobSourceId: "",
      timeSelection: "preset",
      presetTime: "",
      startTime: "09:00",
      endTime: "10:00",
      amount: undefined,
      notes: "",
      parts: "",
      hasSignature: false,
      sendNotification: false,
    },
  });

  // Form field watches
  const technicianId = form.watch("technicianId");
  const contractorId = form.watch("contractorId");
  const jobSourceId = form.watch("jobSourceId");
  const timeSelection = form.watch("timeSelection");
  const hasSignature = form.watch("hasSignature");
  const clientEmail = form.watch("clientEmail");
  const sendNotification = form.watch("sendNotification");
  const amount = form.watch("amount");

  // Selected entities
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [selectedJobSource, setSelectedJobSource] = useState<any>(null);

  // Update selected entities when IDs change
  useEffect(() => {
    if (technicianId) {
      const tech = technicians.find(t => t.id === technicianId);
      setSelectedTechnician(tech || null);
    } else {
      setSelectedTechnician(null);
    }
  }, [technicianId, technicians]);

  useEffect(() => {
    if (contractorId) {
      const contractor = contractors.find(c => c.id === contractorId);
      setSelectedContractor(contractor || null);
    } else {
      setSelectedContractor(null);
    }
  }, [contractorId, contractors]);

  useEffect(() => {
    if (jobSourceId) {
      const source = jobSources.find(s => s.id === jobSourceId);
      setSelectedJobSource(source || null);
    } else {
      setSelectedJobSource(null);
    }
  }, [jobSourceId, jobSources]);

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [signaturePad, setSignaturePad] = useState(false);
  const [technicianSearch, setTechnicianSearch] = useState("");
  const [jobSourceSearch, setJobSourceSearch] = useState("");
  const [contractorSearch, setContractorSearch] = useState("");

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(technicianSearch.toLowerCase())
  );

  const filteredJobSources = jobSources.filter(source =>
    source.name.toLowerCase().includes(jobSourceSearch.toLowerCase())
  );

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(contractorSearch.toLowerCase())
  );

  // Function to format payment information
  const formatPaymentInfo = (entity: any, type: 'technician' | 'contractor' | 'jobSource') => {
    if (!entity) return null;

    let paymentType, paymentValue;
    
    if (type === 'technician' || type === 'contractor') {
      paymentType = entity.paymentType;
      paymentValue = entity.paymentRate;
    } else if (type === 'jobSource') {
      paymentType = entity.paymentType;
      paymentValue = entity.paymentValue;
    }

    if (!paymentType || paymentValue === undefined) return null;

    const icon = paymentType === 'percentage' ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />;
    const value = paymentType === 'percentage' ? `${paymentValue}%` : `$${paymentValue}`;

    return (
      <Badge variant="outline" className="text-xs bg-slate-50">
        {icon}
        <span className="ml-1">{value}</span>
      </Badge>
    );
  };

  // Display payment badges in a row
  const renderPaymentBadges = () => {
    const badges = [];
    
    if (selectedTechnician && selectedTechnician.paymentType && selectedTechnician.paymentRate) {
      badges.push(
        <Badge key="tech" variant="outline" className="text-xs bg-slate-50 mr-2">
          <span className="font-medium mr-1">Tech:</span>
          {selectedTechnician.paymentType === 'percentage' ? 
            <><Percent className="h-3 w-3 inline mr-1" />{selectedTechnician.paymentRate}%</> : 
            <><DollarSign className="h-3 w-3 inline mr-1" />{selectedTechnician.paymentRate}</>}
        </Badge>
      );
    }
    
    if (selectedContractor && selectedContractor.paymentType && selectedContractor.paymentRate) {
      badges.push(
        <Badge key="contr" variant="outline" className="text-xs bg-slate-50 mr-2">
          <span className="font-medium mr-1">Contr:</span>
          {selectedContractor.paymentType === 'percentage' ? 
            <><Percent className="h-3 w-3 inline mr-1" />{selectedContractor.paymentRate}%</> : 
            <><DollarSign className="h-3 w-3 inline mr-1" />{selectedContractor.paymentRate}</>}
        </Badge>
      );
    }
    
    if (selectedJobSource && selectedJobSource.paymentType && selectedJobSource.paymentValue) {
      badges.push(
        <Badge key="source" variant="outline" className="text-xs bg-slate-50">
          <span className="font-medium mr-1">Source:</span>
          {selectedJobSource.paymentType === 'percentage' ? 
            <><Percent className="h-3 w-3 inline mr-1" />{selectedJobSource.paymentValue}%</> : 
            <><DollarSign className="h-3 w-3 inline mr-1" />{selectedJobSource.paymentValue}</>}
        </Badge>
      );
    }
    
    return badges.length > 0 ? (
      <div className="flex flex-wrap gap-2 mt-2">
        {badges}
      </div>
    ) : null;
  };

  const onSubmit = (values: FormValues) => {
    const technician = technicians.find(tech => tech.id === values.technicianId);
    const contractor = values.contractorId ? contractors.find(c => c.id === values.contractorId) : undefined;
    
    let scheduledDate = new Date(values.date);
    const isAllDay = values.timeSelection === "allDay";
    
    if (!isAllDay) {
      let timeString = "";
      
      if (values.timeSelection === "preset" && values.presetTime) {
        timeString = values.presetTime;
      } else if (values.timeSelection === "custom" && values.startTime) {
        timeString = values.startTime;
      }
      
      if (timeString) {
        const isPM = timeString.includes("PM");
        let hours = parseInt(timeString.split(":")[0]);
        const minutes = parseInt(timeString.split(":")[1]?.split(" ")[0] || "0");
        
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        scheduledDate.setHours(hours, minutes, 0, 0);
      } else {
        scheduledDate.setHours(9, 0, 0, 0);
      }
    } else {
      scheduledDate.setHours(0, 0, 0, 0);
    }
    
    const newJob: Job = {
      id: uuidv4(),
      clientName: values.clientName,
      clientId: uuidv4().slice(0, 8),
      technicianName: technician?.name || "",
      technicianId: values.technicianId,
      date: scheduledDate,
      scheduledDate: scheduledDate,
      isAllDay: isAllDay,
      address: values.clientAddress,
      status: "in_progress" as JobStatus,
    };

    if (values.title) {
      newJob.title = values.title;
    }

    if (values.amount) {
      newJob.amount = values.amount;
    }

    if (values.notes) {
      newJob.notes = values.notes;
    }

    if (values.parts) {
      newJob.parts = values.parts.split(/[\n,]+/).map(part => part.trim()).filter(Boolean);
    }

    if (values.clientEmail) {
      newJob.clientEmail = values.clientEmail;
    }

    if (values.clientPhone) {
      newJob.clientPhone = values.clientPhone;
    }

    if (values.jobSourceId) {
      newJob.jobSourceId = values.jobSourceId;
      const source = jobSources.find(src => src.id === values.jobSourceId);
      if (source) {
        newJob.jobSourceName = source.name;
      }
    }

    if (values.contractorId) {
      newJob.contractorId = values.contractorId;
      if (contractor) {
        newJob.contractorName = contractor.name;
      }
    }

    if (signatureData) {
      newJob.signature = signatureData;
    }

    if (images.length > 0) {
      newJob.hasImages = true;
      newJob.imageCount = images.length;
    }

    if (values.sendNotification && values.clientEmail) {
      console.log(`Sending notification to ${values.clientEmail} about new job`);
    }

    onAddJob(newJob);
    onOpenChange(false);
    form.reset();
    setSignatureData(null);
    setImages([]);
    setSignaturePad(false);
  };

  const formatTimeOption = (time: string) => {
    return (
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        {time}
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...fileArray]);
    }
  };

  const handleSignature = () => {
    setSignaturePad(!signaturePad);
    if (!signaturePad) {
      setTimeout(() => {
        setSignatureData("data:image/png;base64,signature-data-placeholder");
      }, 500);
    } else {
      setSignatureData(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="HVAC Installation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="john.smith@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Amount ($) (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00"
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown, CA 90210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Definition (Technician), Job Contractor, and Job Source fields in a single row - rearranged order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Technician field - placed first */}
                <FormField
                  control={form.control}
                  name="technicianId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technician *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a technician" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="px-3 pb-2">
                            <Input
                              placeholder="Search technicians..."
                              value={technicianSearch}
                              onChange={(e) => setTechnicianSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredTechnicians.map((tech) => (
                              <SelectItem key={tech.id} value={tech.id}>
                                {tech.name}
                                {tech.paymentType && tech.paymentRate && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({tech.paymentType === 'percentage' ? 
                                      `${tech.paymentRate}%` : 
                                      `$${tech.paymentRate}`})
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                            {filteredTechnicians.length === 0 && (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                No technicians found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      {selectedTechnician && formatPaymentInfo(selectedTechnician, 'technician')}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Contractor field - moved to second position */}
                <FormField
                  control={form.control}
                  name="contractorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Contractor (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a contractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="px-3 pb-2">
                            <Input
                              placeholder="Search contractors..."
                              value={contractorSearch}
                              onChange={(e) => setContractorSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredContractors.map((contractor) => (
                              <SelectItem key={contractor.id} value={contractor.id}>
                                {contractor.name}
                                {contractor.paymentType && contractor.paymentRate && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({contractor.paymentType === 'percentage' ? 
                                      `${contractor.paymentRate}%` : 
                                      `$${contractor.paymentRate}`})
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                            {filteredContractors.length === 0 && (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                No contractors found
                              </div>
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      {selectedContractor && formatPaymentInfo(selectedContractor, 'contractor')}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Source field - moved to third position */}
                {jobSources.length > 0 && (
                  <FormField
                    control={form.control}
                    name="jobSourceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Source (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a job source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="px-3 pb-2">
                              <Input
                                placeholder="Search job sources..."
                                value={jobSourceSearch}
                                onChange={(e) => setJobSourceSearch(e.target.value)}
                                className="mb-2"
                              />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto">
                              {filteredJobSources.map((source) => (
                                <SelectItem key={source.id} value={source.id}>
                                  {source.name}
                                  {source.paymentType && source.paymentValue && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({source.paymentType === 'percentage' ? 
                                        `${source.paymentValue}%` : 
                                        `$${source.paymentValue}`})
                                    </span>
                                  )}
                                </SelectItem>
                              ))}
                              {filteredJobSources.length === 0 && (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                  No job sources found
                                </div>
                              )}
                            </div>
                          </SelectContent>
                        </Select>
                        {selectedJobSource && formatPaymentInfo(selectedJobSource, 'jobSource')}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Payment badges row */}
              {(selectedTechnician || selectedContractor || selectedJobSource) && renderPaymentBadges()}

              {/* Amount display section when amount is entered */}
              {amount && amount > 0 && (selectedTechnician || selectedContractor || selectedJobSource) && (
                <div className="border rounded-md p-3 bg-slate-50">
                  <h4 className="text-sm font-medium mb-2">Payment Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    {selectedTechnician && selectedTechnician.paymentType && (
                      <div className="flex justify-between">
                        <span>Technician ({selectedTechnician.name}):</span>
                        <span className="font-medium">
                          {selectedTechnician.paymentType === 'percentage' 
                            ? `$${(amount * selectedTechnician.paymentRate / 100).toFixed(2)} (${selectedTechnician.paymentRate}%)`
                            : `$${selectedTechnician.paymentRate}`
                          }
                        </span>
                      </div>
                    )}
                    
                    {selectedContractor && selectedContractor.paymentType && (
                      <div className="flex justify-between">
                        <span>Contractor ({selectedContractor.name}):</span>
                        <span className="font-medium">
                          {selectedContractor.paymentType === 'percentage' 
                            ? `$${(amount * selectedContractor.paymentRate / 100).toFixed(2)} (${selectedContractor.paymentRate}%)`
                            : `$${selectedContractor.paymentRate}`
                          }
                        </span>
                      </div>
                    )}
                    
                    {selectedJobSource && selectedJobSource.paymentType && (
                      <div className="flex justify-between">
                        <span>Job Source ({selectedJobSource.name}):</span>
                        <span className="font-medium">
                          {selectedJobSource.paymentType === 'percentage' 
                            ? `$${(amount * selectedJobSource.paymentValue / 100).toFixed(2)} (${selectedJobSource.paymentValue}%)`
                            : `$${selectedJobSource.paymentValue}`
                          }
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                      <span>Remaining (Company):</span>
                      <span>
                        ${calculateRemainingAmount(amount, selectedTechnician, selectedContractor, selectedJobSource).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date *</FormLabel>
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
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeSelection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Selection</FormLabel>
                      <FormControl>
                        <Tabs 
                          value={field.value} 
                          onValueChange={field.onChange}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="preset">Preset Time</TabsTrigger>
                            <TabsTrigger value="custom">Custom Time</TabsTrigger>
                            <TabsTrigger value="allDay">All Day</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="preset">
                            <FormField
                              control={form.control}
                              name="presetTime"
                              render={({ field }) => (
                                <FormItem className="mt-2">
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      value={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a time">
                                          {field.value ? (
                                            <div className="flex items-center">
                                              <Clock className="mr-2 h-4 w-4" />
                                              {field.value}
                                            </div>
                                          ) : (
                                            <span>Select a time</span>
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timeOptions.map((time) => (
                                          <SelectItem key={time} value={time}>
                                            {formatTimeOption(time)}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
                          
                          <TabsContent value="custom">
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="time" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="time" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="allDay">
                            <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                              This job will be scheduled for the entire day
                            </div>
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any special notes about the job..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parts (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any parts needed for this job..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-lg font-medium mb-3">Additional Options</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Attach Images</h4>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="gap-2"
                    >
                      <ImageIcon size={16} />
                      Add Images
                    </Button>
                    <input 
                      id="image-upload" 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                    {images.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {images.length} image{images.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                  </div>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {images.map((image, index) => (
                        <div key={index} className="bg-gray-100 p-1 rounded text-xs">
                          {image.name.length > 15 ? image.name.substring(0, 15) + '...' : image.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="hasSignature"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Capture Client Signature</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    {hasSignature && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleSignature}
                        className="gap-2"
                      >
                        <FileSignature size={16} />
                        {signatureData ? "Clear Signature" : "Sign Now"}
                      </Button>
                    )}
                  </div>
                  
                  {hasSignature && signaturePad && (
                    <div className="mt-2 border rounded p-4 flex items-center justify-center bg-gray-50 h-[150px]">
                      {signatureData ? (
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium">Signature captured!</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Client signature has been saved
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Signature pad would appear here (placeholder)
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="sendNotification"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            disabled={!clientEmail} 
                            checked={field.value && !!clientEmail} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel className={cn("cursor-pointer", !clientEmail && "opacity-50")}>
                            Send Job Details to Client
                          </FormLabel>
                          {!clientEmail && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Client email required for notifications
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {sendNotification && clientEmail && (
                    <div className="flex items-center gap-2 ml-6 mt-2">
                      <Send size={14} className="text-blue-500" />
                      <p className="text-xs text-muted-foreground">
                        Job details will be sent to {clientEmail}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Job</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to calculate the remaining amount after deducting all payments
const calculateRemainingAmount = (
  amount: number,
  technician: any,
  contractor: any,
  jobSource: any
) => {
  let remaining = amount;
  
  // Subtract technician payment
  if (technician && technician.paymentType && technician.paymentRate) {
    if (technician.paymentType === 'percentage') {
      remaining -= amount * (technician.paymentRate / 100);
    } else {
      remaining -= Math.min(technician.paymentRate, amount); // Can't deduct more than total
    }
  }
  
  // Subtract contractor payment
  if (contractor && contractor.paymentType && contractor.paymentRate) {
    if (contractor.paymentType === 'percentage') {
      remaining -= amount * (contractor.paymentRate / 100);
    } else {
      remaining -= Math.min(contractor.paymentRate, amount); // Can't deduct more than total
    }
  }
  
  // Subtract job source payment
  if (jobSource && jobSource.paymentType && jobSource.paymentValue) {
    if (jobSource.paymentType === 'percentage') {
      remaining -= amount * (jobSource.paymentValue / 100);
    } else {
      remaining -= Math.min(jobSource.paymentValue, amount); // Can't deduct more than total
    }
  }
  
  return Math.max(0, remaining); // Ensure it's never negative
};

export default CreateJobModal;
