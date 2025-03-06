
import { 
  UsersIcon, 
  ClipboardListIcon, 
  BarChart3Icon, 
  CalendarIcon 
} from "lucide-react";
import StatCard from "@/components/StatCard";
import RecentActivityCard from "@/components/RecentActivityCard";
import UpcomingEvents from "@/components/UpcomingEvents";

const Dashboard = () => {
  const activities = [
    {
      id: "1",
      type: "call" as const,
      title: "Phone call with John Doe",
      time: "2 hours ago",
      user: {
        name: "Alex Johnson",
        initials: "AJ",
      },
      client: {
        name: "John Doe",
        initials: "JD",
      },
    },
    {
      id: "2",
      type: "email" as const,
      title: "Sent proposal to Tech Solutions Inc.",
      time: "Yesterday",
      user: {
        name: "Sarah Miller",
        initials: "SM",
      },
      client: {
        name: "Tech Solutions Inc.",
        initials: "TS",
      },
    },
    {
      id: "3",
      type: "meeting" as const,
      title: "Project kickoff meeting",
      time: "2 days ago",
      user: {
        name: "Alex Johnson",
        initials: "AJ",
      },
      client: {
        name: "Acme Corp",
        initials: "AC",
      },
    },
    {
      id: "4",
      type: "task" as const,
      title: "Updated client information",
      time: "3 days ago",
      user: {
        name: "Sarah Miller",
        initials: "SM",
      },
    },
  ];

  const events = [
    {
      id: "1",
      title: "Client Meeting",
      datetime: new Date(new Date().setHours(new Date().getHours() + 2)),
      type: "meeting" as const,
      clientName: "Acme Corp",
    },
    {
      id: "2",
      title: "Follow-up Call",
      datetime: new Date(new Date().setHours(new Date().getHours() + 5)),
      type: "call" as const,
      clientName: "John Doe",
    },
    {
      id: "3",
      title: "Proposal Deadline",
      datetime: new Date(new Date().setDate(new Date().getDate() + 1)),
      type: "deadline" as const,
      clientName: "Tech Solutions Inc.",
    },
  ];

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Welcome back, Alex
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your clients today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value="43"
          icon={<UsersIcon size={16} />}
          trend={{
            value: "12% from last month",
            isPositive: true,
          }}
        />
        <StatCard
          title="Active Tasks"
          value="17"
          icon={<ClipboardListIcon size={16} />}
          description="5 due today"
        />
        <StatCard
          title="This Month's Revenue"
          value="$24,500"
          icon={<BarChart3Icon size={16} />}
          trend={{
            value: "8% from last month",
            isPositive: true,
          }}
        />
        <StatCard
          title="Upcoming Meetings"
          value="8"
          icon={<CalendarIcon size={16} />}
          description="3 this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={activities} />
        </div>
        <div>
          <UpcomingEvents events={events} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
