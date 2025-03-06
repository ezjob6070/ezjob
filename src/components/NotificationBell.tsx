
import { useState } from 'react';
import { BellIcon } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Client Added',
    message: 'Alex Johnson was added to your client list',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    title: 'Task Due',
    message: 'Follow-up with Innovate Solutions is due today',
    time: '2 hours ago',
    read: false
  },
  {
    id: '3',
    title: 'Meeting Reminder',
    message: 'Quarterly review meeting tomorrow at 10:00 AM',
    time: 'Yesterday',
    read: true
  }
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7 text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${notification.read ? '' : 'bg-blue-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-xs mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
