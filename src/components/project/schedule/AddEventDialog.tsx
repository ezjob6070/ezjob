
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleEvent } from "./types";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: Omit<ScheduleEvent, "id">;
  setNewEvent: (event: Omit<ScheduleEvent, "id">) => void;
  handleAddEvent: () => void;
}

export default function AddEventDialog({
  open,
  onOpenChange,
  newEvent,
  setNewEvent,
  handleAddEvent
}: AddEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="event-type" className="text-sm font-medium">
              Event Type
            </label>
            <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as ScheduleEvent["type"] })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid gap-2">
            <label htmlFor="event-title" className="text-sm font-medium">
              Event Title
            </label>
            <Input
              id="event-title"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="event-start" className="text-sm font-medium">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEvent.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.start ? format(newEvent.start, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEvent.start}
                    onSelect={(date) => setNewEvent({ ...newEvent, start: date || new Date() })}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <label htmlFor="event-end" className="text-sm font-medium">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEvent.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.end ? format(newEvent.end, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEvent.end}
                    onSelect={(date) => setNewEvent({ ...newEvent, end: date || new Date() })}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="event-location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="event-location"
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="event-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="event-description"
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddEvent}>
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
