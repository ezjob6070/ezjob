
import React, { useState } from "react";
import { Job } from "./JobTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UpdateJobStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onCancel: (jobId: string) => void;
  onComplete: (jobId: string, actualAmount: number) => void;
  onReschedule?: (jobId: string, newDate: Date, isAllDay: boolean) => void;
}

// Time options for quick selection
const timeOptions = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM"
];

const UpdateJobStatusModal: React.FC<UpdateJobStatusModalProps> = ({
  open,
  onOpenChange,
  job,
  onCancel,
  onComplete,
  onReschedule,
}) => {
  const [status, setStatus] = useState<"completed" | "cancelled" | "reschedule">("completed");
  const [actualAmount, setActualAmount] = useState<number>(job?.amount || 0);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(
    job?.scheduledDate ? new Date(job.scheduledDate) : new Date()
  );
  const [timeSelection, setTimeSelection] = useState<"preset" | "custom" | "allDay">("preset");
  const [presetTime, setPresetTime] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [parts, setParts] = useState<string>("");
  
  if (!job) return null;

  const formatTimeOption = (time: string) => {
    return (
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        {time}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "completed") {
      onComplete(job.id, actualAmount);
    } else if (status === "cancelled") {
      onCancel(job.id);
    } else if (status === "reschedule" && rescheduleDate && onReschedule) {
      // Create date with time if not all day
      let scheduledDate = new Date(rescheduleDate);
      const isAllDay = timeSelection === "allDay";
      
      if (!isAllDay) {
        let timeString = "";
        
        if (timeSelection === "preset" && presetTime) {
          timeString = presetTime;
        } else if (timeSelection === "custom" && startTime) {
          timeString = startTime;
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
      
      onReschedule(job.id, scheduledDate, isAllDay);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
            <DialogDescription>
              Mark this job as completed, cancelled, or reschedule it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Job Details</h4>
              <p className="text-sm text-muted-foreground">Client: {job.clientName}</p>
              <p className="text-sm text-muted-foreground">
                Technician: {job.technicianName || "Unassigned"}
              </p>
              <p className="text-sm text-muted-foreground">
                Initial Estimate: {job.amount ? formatCurrency(job.amount) : "No estimate provided"}
              </p>
              {job.notes && (
                <p className="text-sm text-muted-foreground">
                  Special Notes: {job.notes}
                </p>
              )}
              {job.jobSourceName && (
                <p className="text-sm text-muted-foreground">
                  Source: {job.jobSourceName}
                </p>
              )}
            </div>

            <RadioGroup value={status} onValueChange={(value) => setStatus(value as "completed" | "cancelled" | "reschedule")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <Label htmlFor="cancelled">Cancelled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reschedule" id="reschedule" />
                <Label htmlFor="reschedule">Reschedule</Label>
              </div>
            </RadioGroup>

            {status === "completed" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="actualAmount">Actual Amount ($)</Label>
                  <Input
                    id="actualAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parts">Parts Used (Optional)</Label>
                  <Input
                    id="parts"
                    placeholder="e.g., AC filter, pipe fitting, etc."
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                  />
                </div>
              </div>
            )}

            {status === "reschedule" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Reschedule Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !rescheduleDate && "text-muted-foreground"
                        )}
                      >
                        {rescheduleDate ? (
                          format(rescheduleDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={rescheduleDate}
                        onSelect={setRescheduleDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Time Selection</Label>
                  <Tabs 
                    value={timeSelection} 
                    onValueChange={(v) => setTimeSelection(v as "preset" | "custom" | "allDay")}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="preset">Preset Time</TabsTrigger>
                      <TabsTrigger value="custom">Custom Time</TabsTrigger>
                      <TabsTrigger value="allDay">All Day</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preset">
                      <div className="mt-2">
                        <Select 
                          onValueChange={setPresetTime} 
                          value={presetTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time">
                              {presetTime ? (
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {presetTime}
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
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom">
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input 
                            id="startTime"
                            type="time" 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input 
                            id="endTime"
                            type="time" 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="allDay">
                      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                        This job will be scheduled for the entire day
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobStatusModal;
