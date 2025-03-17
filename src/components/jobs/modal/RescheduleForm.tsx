
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

// Time options for quick selection
const timeOptions = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
  "04:00 PM", "05:00 PM", "06:00 PM"
];

interface RescheduleFormProps {
  rescheduleDate: Date | undefined;
  setRescheduleDate: (date: Date | undefined) => void;
  timeSelection: "preset" | "custom" | "allDay";
  setTimeSelection: (selection: "preset" | "custom" | "allDay") => void;
  presetTime: string;
  setPresetTime: (time: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

const RescheduleForm: React.FC<RescheduleFormProps> = ({
  rescheduleDate,
  setRescheduleDate,
  timeSelection,
  setTimeSelection,
  presetTime,
  setPresetTime,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => {
  const formatTimeOption = (time: string) => {
    return (
      <div className="flex items-center">
        <Clock className="mr-2 h-4 w-4" />
        {time}
      </div>
    );
  };

  return (
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
  );
};

export default RescheduleForm;
