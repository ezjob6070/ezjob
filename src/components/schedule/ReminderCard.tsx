
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
    if (reminder.status === "completed") return "bg-green-100/70 text-green-800 border-green-200";
    if (isPastDue()) return "bg-red-50 text-red-700 border-red-200";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className={`p-4 bg-white rounded-lg border ${
      reminder.status === "completed" 
        ? "border-green-100 bg-white/80" 
        : isPastDue() 
          ? "border-red-100" 
          : "border-blue-100"
    } hover:shadow-sm transition-all duration-200`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <Bell className={`h-4 w-4 ${
            reminder.status === "completed" ? "text-green-500" : 
            isPastDue() ? "text-red-500" : "text-blue-500"
          } mr-2`} />
          <h3 className={`font-medium ${
            reminder.status === "completed" ? "text-gray-500" : "text-gray-800"
          }`}>{reminder.title}</h3>
        </div>
        <Badge className={`${getReminderStatusColor()} text-xs font-normal shadow-none`}>
          {reminder.status === "completed" ? "Completed" : isPastDue() ? "Overdue" : "Scheduled"}
        </Badge>
      </div>

      <div className="ml-6 space-y-1 mb-3">
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {formatTime(reminder.dueDate)}
        </div>

        {reminder.description && (
          <p className="text-sm text-gray-600">{reminder.description}</p>
        )}
        
        {reminder.client && (
          <p className="text-sm text-gray-500">For: {reminder.client.name}</p>
        )}
      </div>

      {reminder.status !== "completed" && (
        <div className="ml-6 flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 text-sm hover:bg-green-50 text-green-600 hover:text-green-700"
            onClick={handleComplete}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Complete
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 text-sm hover:bg-blue-50 text-blue-600 hover:text-blue-700"
            onClick={handleSnooze}
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            Snooze
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReminderCard;
