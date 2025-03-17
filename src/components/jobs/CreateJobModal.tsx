
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: Job) => void;
  technicians: { id: string; name: string }[];
  jobSources?: { id: string; name: string }[];
}

// Time options for quick selection
const timeOptions = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM"
];

// Update the form schema with the new fields
const formSchema = z.object({
  title: z.string().optional(),
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
  clientPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  clientAddress: z.string().min(5, "Address must be at least 5 characters"),
  technicianId: z.string().min(1, "Please select a technician"),
  jobSourceId: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  isAllDay: z.boolean().default(false),
  timeSelection: z.enum(["preset", "custom"]).default("preset"),
  presetTime: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  amount: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  open,
  onOpenChange,
  onAddJob,
  technicians,
  jobSources = [],
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
      jobSourceId: "",
      isAllDay: false,
      timeSelection: "preset",
      presetTime: "",
      startTime: "09:00",
      endTime: "10:00",
      amount: undefined,
      notes: "",
    },
  });

  // Watch the isAllDay field to conditionally show/hide the time field
  const isAllDay = form.watch("isAllDay");
  const timeSelection = form.watch("timeSelection");

  const onSubmit = (values: FormValues) => {
    // Find technician name
    const technician = technicians.find(tech => tech.id === values.technicianId);
    
    // Create date with time if not all day
    let scheduledDate = new Date(values.date);
    
    if (!values.isAllDay) {
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
        
        // Convert 12-hour format to 24-hour if needed
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        scheduledDate.setHours(hours, minutes, 0, 0);
      } else {
        // Default to 9 AM if no time is specified
        scheduledDate.setHours(9, 0, 0, 0);
      }
    } else {
      // For all-day events, set to start of day
      scheduledDate.setHours(0, 0, 0, 0);
    }
    
    // Generate new job - defaulting to in_progress status
    const newJob: Job = {
      id: uuidv4(),
      clientName: values.clientName,
      clientId: uuidv4().slice(0, 8),
      technicianName: technician?.name || "",
      technicianId: values.technicianId,
      date: scheduledDate,
      scheduledDate: scheduledDate,
      isAllDay: values.isAllDay,
      address: values.clientAddress,
      status: "in_progress" as JobStatus,
      createdAt: new Date(),
    };

    // Add optional fields
    if (values.title) {
      newJob.title = values.title;
    }

    if (values.amount) {
      newJob.amount = values.amount;
    }

    if (values.notes) {
      newJob.notes = values.notes;
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

    onAddJob(newJob);
    onOpenChange(false);
    form.reset();
  };

  // Format time for display
  const formatTimeOption = (time: string) => {
    return (
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        {time}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                {jobSources.length > 0 && (
                  <FormField
                    control={form.control}
                    name="jobSourceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Source (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a job source" />
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
                )}
              </div>

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

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="isAllDay"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>All Day Job</FormLabel>
                          <FormDescription>
                            Job will be scheduled for the entire day
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!isAllDay && (
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
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="preset">Preset Time</TabsTrigger>
                                <TabsTrigger value="custom">Custom Time</TabsTrigger>
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
                            </Tabs>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

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

export default CreateJobModal;
