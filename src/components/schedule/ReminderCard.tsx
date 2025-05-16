
import { Bell, CheckCircle, Clock } from "lucide-react";
import { Task } from "@/components/calendar/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ReminderCardProps {
  reminder: Task;
  onReminderUpdate?: (reminderId: string, updates: Partial<Task>) => void;
}

const ReminderCard = ({ reminder, onReminderUpdate }: ReminderCardProps) => {
  const handleComplete = () => {
    if (onReminderUpdate) {
      onReminderUpdate(reminder.id, { status: "completed" });
      toast.success("Reminder marked as completed");
    }
  };

  const handleSnooze = () => {
    // Create new date 1 hour from now
    const snoozeTime = new Date();
    snoozeTime.setHours(snoozeTime.getHours() + 1);
    
    if (onReminderUpdate) {
      onReminderUpdate(reminder.id, { 
        dueDate: snoozeTime,
        status: "scheduled" 
      });
      toast.success("Reminder snoozed for 1 hour");
    }
  };

  const formatTime = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return format(date, "h:mm a");
  };

  const isPastDue = () => {
    const now = new Date();
    const dueDate = typeof reminder.dueDate === 'string' 
      ? new Date(reminder.dueDate) 
      : reminder.dueDate;
    return dueDate < now && reminder.status !== "completed";
  };

  const getReminderStatusColor = () => {
    if (reminder.status === "completed") return "bg-green-100 text-green-800";
    if (isPastDue()) return "bg-red-100 text-red-800";
    return "bg-purple-100 text-purple-800";
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${reminder.status === "completed" ? "opacity-70" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="font-medium">{reminder.title}</h3>
        </div>
        <Badge className={getReminderStatusColor()}>
          {reminder.status === "completed" ? "Completed" : isPastDue() ? "Overdue" : "Scheduled"}
        </Badge>
      </div>

      <div className="ml-7 space-y-1 mb-3">
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatTime(reminder.dueDate)}
        </div>

        {reminder.description && (
          <p className="text-sm text-gray-600">{reminder.description}</p>
        )}
        
        {reminder.client && (
          <p className="text-sm text-gray-600">For: {reminder.client.name}</p>
        )}
      </div>

      {reminder.status !== "completed" && (
        <div className="ml-7 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
            onClick={handleComplete}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-purple-200 hover:bg-purple-50 text-purple-700"
            onClick={handleSnooze}
          >
            <Clock className="h-4 w-4 mr-1" />
            Snooze
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReminderCard;
