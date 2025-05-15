
import { useState } from "react";
import { Task } from "@/components/calendar/types";
import { format } from "date-fns";
import {
  Calendar,
  Bell,
  Check,
  Clock,
  User,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ReminderCardProps {
  reminder: Task;
  onReminderUpdate?: (reminderId: string, updates: Partial<Task>) => void;
}

const ReminderCard = ({ reminder, onReminderUpdate }: ReminderCardProps) => {
  const [isSending, setIsSending] = useState(false);

  const handleStatusChange = (status: string) => {
    if (onReminderUpdate) {
      onReminderUpdate(reminder.id, { status });
      toast.success(`Reminder marked as ${status}`);
    }
  };

  const handleSendNow = () => {
    setIsSending(true);
    setTimeout(() => {
      if (onReminderUpdate) {
        onReminderUpdate(reminder.id, { 
          reminderSent: true,
          status: "completed" 
        });
        toast.success("Reminder sent successfully");
      }
      setIsSending(false);
    }, 1000);
  };

  const reminderTime = reminder.reminderTime 
    ? format(new Date(`2000-01-01T${reminder.reminderTime}`), 'h:mm a')
    : "All day";

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const priorityColor = reminder.priority ? priorityColors[reminder.priority] : priorityColors.medium;
  
  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    overdue: "bg-red-100 text-red-800",
    "in progress": "bg-amber-100 text-amber-800",
  };

  return (
    <div className="border rounded-md p-3 bg-card hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <Bell className="h-4 w-4 text-primary mt-1" />
          <div>
            <h4 className="font-medium line-clamp-1">{reminder.title}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {reminderTime}
              </div>
              {reminder.client && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {reminder.client.name}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSendNow} disabled={isSending || reminder.reminderSent}>
              Send Reminder Now
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>
              Cancel Reminder
            </DropdownMenuItem>
            {new Date(reminder.dueDate) < new Date() && !reminder.reminderSent && (
              <DropdownMenuItem onClick={() => handleStatusChange("scheduled")}>
                Reschedule
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge 
          variant="outline"
          className={statusColors[reminder.status as keyof typeof statusColors] || statusColors.scheduled}
        >
          {reminder.reminderSent ? "Sent" : reminder.status}
        </Badge>
        
        {reminder.priority && (
          <Badge variant="outline" className={priorityColor}>
            {reminder.priority}
          </Badge>
        )}
      </div>
      
      {reminder.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {reminder.description}
        </p>
      )}
      
      {new Date(reminder.dueDate) < new Date() && !reminder.reminderSent && (
        <div className="mt-2 flex items-center text-xs text-red-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </div>
      )}
      
      <div className="mt-3 flex justify-between">
        {!reminder.reminderSent ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleSendNow}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Now"}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            disabled
          >
            <Check className="h-3 w-3 mr-1" />
            Sent
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReminderCard;
