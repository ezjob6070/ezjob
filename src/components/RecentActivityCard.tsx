
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Activity = {
  id: string;
  type: "call" | "email" | "meeting" | "task";
  title: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  client?: {
    name: string;
    avatar?: string;
    initials: string;
  };
};

const activityIcons = {
  call: "📞",
  email: "📧",
  meeting: "👥",
  task: "✓",
};

type RecentActivityCardProps = {
  activities: Activity[];
};

const RecentActivityCard = ({ activities }: RecentActivityCardProps) => {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-4 border-b border-border last:border-0"
            >
              <div className="mr-4 mt-0.5 text-lg">
                {activityIcons[activity.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                {activity.client && (
                  <div className="flex items-center mt-1">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={activity.client.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {activity.client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {activity.client.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-col items-end">
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground mr-1">
                    by
                  </span>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className="text-[10px]">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
