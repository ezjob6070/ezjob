import { 
  UsersIcon, 
  ClipboardListIcon, 
  BarChart3Icon, 
  CalendarIcon,
  BriefcaseIcon,
  PhoneCallIcon,
  CalculatorIcon,
  DollarSignIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PercentIcon,
  PieChartIcon,
  TargetIcon,
  MailIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import RecentActivityCard from "@/components/RecentActivityCard";
import UpcomingEvents from "@/components/UpcomingEvents";
import { DonutChart } from "@/components/DonutChart";

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
    joby: 5,
    inProgress: 21,
    submitted: 8,
    draft: 12,
    completed: 19,
    canceled: 3
  };

  // Total tasks
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

  // Financial metrics - sample data
  const financialMetrics = {
    totalRevenue: 125000,
    companysCut: 25000,
    pendingInvoices: 15000,
    avgJobValue: 2500,
    monthlyGrowth: 8.5,
    conversionRate: 24
  };

  // Lead sources data
  const leadSources = [
    { name: "Website", value: 35 },
    { name: "Referrals", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Direct", value: 15 },
    { name: "Other", value: 5 }
  ];

  // Performance by job type
  const jobTypePerformance = [
    { name: "Maintenance", value: 45 },
    { name: "Installation", value: 30 },
    { name: "Consulting", value: 15 },
    { name: "Emergency", value: 10 }
  ];

  // Top performing technicians
  const topTechnicians = [
    { name: "Sarah Miller", jobs: 45, revenue: 78500, rating: 4.9 },
    { name: "Alex Johnson", jobs: 38, revenue: 62000, rating: 4.8 },
    { name: "James Wilson", jobs: 36, revenue: 59000, rating: 4.7 },
    { name: "Emily Brown", jobs: 32, revenue: 53000, rating: 4.9 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="bg-blue-600 -mx-6 -mt-6 px-6 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="mr-3">
              <span className="text-yellow-200 text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hello, Alex Johnson</h1>
              <p className="text-blue-100">Welcome to your Uleadz CRM dashboard</p>
            </div>
          </div>
          <div>
            <Button 
              variant="secondary" 
              className="bg-white/20 text-white hover:bg-white/30 border-none"
            >
              <MailIcon className="mr-2 h-4 w-4" />
              <span>Send Reports</span>
            </Button>
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
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Calls"
          value="28"
          icon={<PhoneCallIcon size={20} />}
          description="Total calls this month"
          trend={{ value: "12%", isPositive: true }}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Jobs"
          value="68"
          icon={<BriefcaseIcon size={20} />}
          description="Active jobs in progress"
          trend={{ value: "8%", isPositive: true }}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(financialMetrics.totalRevenue)}
          icon={<CalculatorIcon size={20} />}
          description="Revenue this month"
          trend={{ value: "5%", isPositive: false }}
          className="bg-white hover:shadow-md"
        />
        <StatCard
          title="Company's Cut"
          value={formatCurrency(financialMetrics.companysCut)}
          icon={<DollarSignIcon size={20} />}
          description="Commission earned"
          trend={{ value: "7%", isPositive: true }}
          className="bg-white hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tickets By Status</CardTitle>
            <div className="flex mt-2 space-x-2">
              <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Status</Badge>
              <Badge variant="outline" className="rounded-full">Map</Badge>
              <Badge variant="outline" className="rounded-full">Time</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DonutChart 
                  data={[
                    { name: "Joby", value: taskCounts.joby, color: "#3b82f6" },
                    { name: "In Progress", value: taskCounts.inProgress, color: "#8b5cf6" },
                    { name: "Submitted", value: taskCounts.submitted, color: "#6b7280" },
                    { name: "Draft", value: taskCounts.draft, color: "#f97316" },
                    { name: "Completed", value: taskCounts.completed, color: "#22c55e" },
                    { name: "Canceled", value: taskCounts.canceled, color: "#ef4444" }
                  ]}
                  title={`${totalTasks}`}
                  subtitle="Total Tickets"
                />
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
                
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white mr-3">
                    <ClipboardListIcon />
                  </div>
                  <div>
                    <div className="font-medium">Draft</div>
                    <div className="text-xl font-bold">{taskCounts.draft}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mr-3">
                  <CheckCircleIcon />
                </div>
                <div>
                  <div className="font-medium">Completed</div>
                  <div className="text-xl font-bold">{taskCounts.completed}</div>
                </div>
              </div>
              
              <div className="flex items-center">
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Performance By Job Source</CardTitle>
            <div className="flex mt-2 space-x-2">
              <Badge variant="secondary" className="bg-gray-700 text-white rounded-full">Job Source</Badge>
              <Badge variant="outline" className="rounded-full">Job Type</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Lead Sources</h4>
                <div className="space-y-3">
                  {leadSources.map((source) => (
                    <div key={source.name} className="flex items-center">
                      <div className="w-32 mr-2">
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${source.value}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{source.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Job Types</h4>
                <div className="space-y-3">
                  {jobTypePerformance.map((jobType) => (
                    <div key={jobType.name} className="flex items-center">
                      <div className="w-32 mr-2">
                        <span className="text-sm font-medium">{jobType.name}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${jobType.value}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{jobType.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Business Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Avg. Job Value</span>
                  <span className="text-xl font-bold mt-1">{formatCurrency(financialMetrics.avgJobValue)}</span>
                </div>
                <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Monthly Growth</span>
                  <div className="flex items-center mt-1">
                    <span className="text-xl font-bold">{financialMetrics.monthlyGrowth}%</span>
                    <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
                  </div>
                </div>
                <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <div className="flex items-center mt-1">
                    <span className="text-xl font-bold">{financialMetrics.conversionRate}%</span>
                    <PercentIcon className="h-4 w-4 text-blue-500 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Top Technicians</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topTechnicians.map((technician, index) => (
              <Card key={technician.name} className="border-none shadow-sm bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-full bg-blue-${index === 0 ? '600' : '500'} flex items-center justify-center text-white mr-3`}>
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{technician.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Rating: {technician.rating}/5
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Jobs</span>
                      <span className="font-bold">{technician.jobs}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-bold">{formatCurrency(technician.revenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard activities={activities} />
        <UpcomingEvents events={events} />
      </div>
    </div>
  );
};

export default Dashboard;
