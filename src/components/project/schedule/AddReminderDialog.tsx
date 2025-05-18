
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduleEvent } from "./types";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newReminder: Omit<ScheduleEvent, "id">;
  setNewReminder: (reminder: Omit<ScheduleEvent, "id">) => void;
  handleAddReminder: () => void;
}

export default function AddReminderDialog({
  open,
  onOpenChange,
  newReminder,
  setNewReminder,
  handleAddReminder
}: AddReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Add New Reminder
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="reminder-title" className="text-sm font-medium">
              Reminder Title
            </label>
            <Input
              id="reminder-title"
              placeholder="What do you need to remember?"
              value={newReminder.title}
              onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="reminder-date" className="text-sm font-medium">
              Reminder Date & Time
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !newReminder.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newReminder.start ? format(newReminder.start, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newReminder.start}
                    onSelect={(date) => {
                      if (date) {
                        const currentStart = newReminder.start;
                        const hours = currentStart.getHours();
                        const minutes = currentStart.getMinutes();
                        
                        const newDate = new Date(date);
                        newDate.setHours(hours, minutes);
                        
                        setNewReminder({
                          ...newReminder,
                          start: newDate,
                          end: new Date(newDate.getTime() + 30 * 60000) // 30 min later
                        });
                      }
                    }}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              
              <div>
                <Input 
                  type="time"
                  value={`${newReminder.start.getHours().toString().padStart(2, '0')}:${newReminder.start.getMinutes().toString().padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    
                    const newDate = new Date(newReminder.start);
                    newDate.setHours(hours, minutes);
                    
                    setNewReminder({
                      ...newReminder,
                      start: newDate,
                      end: new Date(newDate.getTime() + 30 * 60000) // 30 min later
                    });
                  }}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="reminder-description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="reminder-description"
              placeholder="Add more details about this reminder"
              value={newReminder.description || ""}
              onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleAddReminder}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Bell className="h-4 w-4 mr-2" /> Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
