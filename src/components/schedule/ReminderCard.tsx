
import { Task } from "@/components/calendar/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Bell, Calendar, Clock, User, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReminderCardProps {
  reminder: Task;
  onReminderUpdate: (reminderId: string, updates: Partial<Task>) => void;
}

const ReminderCard = ({ reminder, onReminderUpdate }: ReminderCardProps) => {
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling up to parent click handlers
    const newStatus = reminder.status === "completed" ? "scheduled" : "completed";
    onReminderUpdate(reminder.id, { status: newStatus });
    
    toast.success(
      newStatus === "completed" 
        ? "Reminder marked as completed!" 
        : "Reminder reopened."
    );
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling up to parent click handlers
    onReminderUpdate(reminder.id, { reminderSent: true });
    toast.success("Reminder dismissed");
  };

  return (
    <div className={cn(
      "border rounded-lg p-3 relative",
      reminder.status === "completed" ? "opacity-80" : ""
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={reminder.status === "completed"}
            onCheckedChange={() => {}}
            onClick={handleToggleComplete}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-red-500" />
                <h3 className={cn(
                  "font-medium",
                  reminder.status === "completed" ? "line-through text-muted-foreground" : ""
                )}>
                  {reminder.title}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {reminder.client && reminder.client.name && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {reminder.client.name}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(reminder.dueDate), "MMM d")}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(reminder.dueDate), "h:mm a")}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant="outline" 
                className={reminder.reminderSent ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}
              >
                {reminder.reminderSent ? "Sent" : "Active"}
              </Badge>
            </div>
          </div>
          
          {reminder.description && (
            <p className={cn(
              "text-xs text-muted-foreground mt-2 line-clamp-2",
              reminder.status === "completed" ? "text-muted-foreground/70" : ""
            )}>
              {reminder.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-end">
            {!reminder.reminderSent && reminder.status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
