
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentActivityCard activities={activities} />
      <UpcomingEvents events={events} />
    </div>
  );
};

export default ActivitySection;
