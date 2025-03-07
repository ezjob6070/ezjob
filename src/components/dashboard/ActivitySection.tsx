
import React from "react";
import RecentActivityCard from "@/components/RecentActivityCard";
import UpcomingEvents from "@/components/UpcomingEvents";

type ActivitySectionProps = {
  activities: Array<{
    id: string;
    type: "call" | "email" | "meeting" | "task";
    title: string;
    time: string;
    user: {
      name: string;
      initials: string;
    };
    client?: {
      name: string;
      initials: string;
    };
  }>;
  events: Array<{
    id: string;
    title: string;
    datetime: Date;
    type: "meeting" | "call" | "deadline";
    clientName?: string;
  }>;
};

const ActivitySection = ({ activities, events }: ActivitySectionProps) => {
  // Filter activities for the most recent ones
  const recentActivities = activities.slice(0, 5);
  
  // Filter upcoming events for the nearest ones
  const upcomingEvents = events
    .filter(event => event.datetime > new Date())
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .slice(0, 5);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentActivityCard activities={recentActivities} />
      <UpcomingEvents events={upcomingEvents} />
    </div>
  );
};

export default ActivitySection;
