
import React from "react";
import { Task } from "@/components/calendar/types";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Bell,
  Clock,
  Calendar,
  MoreVertical,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ReminderCardProps {
  reminder: Task;
  onReminderUpdate: (id: string, updates: Partial<Task>) => void;
}

const ReminderCard = ({ reminder, onReminderUpdate }: ReminderCardProps) => {
  const handleStatusChange = (status: string) => {
    if (onReminderUpdate) {
      onReminderUpdate(reminder.id, { status });
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "No date";
    return typeof date === 'string' ? format(new Date(date), "MMM d, yyyy") : format(date, "MMM d, yyyy");
  };

  const formatTime = (time?: string) => {
    if (!time) return "No time set";
    
    try {
      const [hours, minutes] = time.split(':').map(Number);
      return new Date().setHours(hours, minutes, 0, 0);
    } catch (e) {
      return "Invalid time";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base font-medium">
              {reminder.title}
            </CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onReminderUpdate(reminder.id, { title: "Updated " + reminder.title })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                Mark as Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(reminder.dueDate)}</span>
            </div>
            
            {reminder.reminderTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{reminder.reminderTime}</span>
              </div>
            )}
          </div>
          
          {reminder.description && (
            <p className="text-sm text-gray-600">{reminder.description}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Badge className={getStatusColor(reminder.status)}>
          {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
        </Badge>
        
        {reminder.reminderSent && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Sent</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReminderCard;
