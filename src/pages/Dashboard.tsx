
import { 
  UsersIcon, 
  ClipboardListIcon, 
  BarChart3Icon, 
  CalendarIcon,
  BriefcaseIcon,
  PhoneCallIcon,
  CalculatorIcon,
  DollarSignIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

  // Task status counts
  const taskCounts = {
    joby: 0,
    inProgress: 21,
    submitted: 0,
    draft: 1,
    completed: 0,
    canceled: 3
  };

  // Total tasks
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6 py-6">
      <div className="bg-blue-600 -mx-6 -mt-6 px-6 pt-6 pb-8 text-white">
        <div className="flex items-center mb-2">
          <div className="mr-3">
            <span className="text-yellow-200 text-3xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Hello, Alex Johnson</h1>
            <p className="text-blue-100">Have a great day!</p>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="mt-4">
          <TabsList className="bg-blue-700/30 text-white">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Statistics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calls"
          value="0"
          icon={<PhoneCallIcon size={20} />}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Jobs"
          value="25"
          icon={<BriefcaseIcon size={20} />}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Total"
          value="$0"
          icon={<CalculatorIcon size={20} />}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Company's Cut"
          value="$0"
          icon={<DollarSignIcon size={20} />}
          className="bg-white hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg">Tickets By</h3>
              <div className="flex mt-2 space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Status</Badge>
                <Badge variant="outline" className="rounded-full">Map</Badge>
                <Badge variant="outline" className="rounded-full">Time</Badge>
              </div>
            </div>
            
            <div className="p-6 flex">
              <div className="flex-1 flex justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 rounded-full border-[20px] border-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">Tickets</div>
                      <div className="text-4xl font-bold">{totalTasks}</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-[20px] border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
                    style={{ transform: 'rotate(-45deg)' }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <BriefcaseIcon />
                  </div>
                  <div>
                    <div className="font-medium">Joby</div>
                    <div className="text-xl font-bold">{taskCounts.joby}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <ClipboardListIcon />
                  </div>
                  <div>
                    <div className="font-medium">In Progress</div>
                    <div className="text-xl font-bold">{taskCounts.inProgress}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <UsersIcon />
                  </div>
                  <div>
                    <div className="font-medium">Submitted</div>
                    <div className="text-xl font-bold">{taskCounts.submitted}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <ClipboardListIcon />
                </div>
                <div>
                  <div className="font-medium">Draft</div>
                  <div className="text-xl font-bold">{taskCounts.draft}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <CheckCircleIcon />
                </div>
                <div>
                  <div className="font-medium">Completed</div>
                  <div className="text-xl font-bold">{taskCounts.completed}</div>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <XCircleIcon />
                </div>
                <div>
                  <div className="font-medium">Canceled</div>
                  <div className="text-xl font-bold">{taskCounts.canceled}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg">Top Performance By</h3>
              <div className="flex mt-2 space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Job Source</Badge>
                <Badge variant="outline" className="rounded-full">Job Type</Badge>
              </div>
            </div>
            
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center text-muted-foreground">
              <div className="mb-4">
                <img 
                  src="public/lovable-uploads/d0bf8818-71ce-4aa6-91a7-c18dcfaef0a3.png" 
                  alt="Performance chart" 
                  className="w-32 opacity-20"
                />
              </div>
              <p>Here you will see your job performance by job source</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg">Top Technicians</h3>
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground">
            <div className="mb-4">
              <img 
                src="public/lovable-uploads/d0bf8818-71ce-4aa6-91a7-c18dcfaef0a3.png" 
                alt="Technician performance" 
                className="w-32 opacity-20"
              />
            </div>
            <p>Here you will see your technician performance by jobs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Additional icon components needed
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default Dashboard;
