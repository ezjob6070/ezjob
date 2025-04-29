
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, UserRoundIcon, PhoneIcon, MessageSquareIcon, 
  ClipboardListIcon, UsersIcon, BarChart3, TrendingUpIcon
} from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const GeneralDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  // Sample business metrics data
  const businessMetrics = [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 36000, profit: 16000 },
    { month: 'Mar', revenue: 49000, expenses: 34000, profit: 15000 },
    { month: 'Apr', revenue: 58000, expenses: 38000, profit: 20000 },
    { month: 'May', revenue: 62000, expenses: 40000, profit: 22000 },
    { month: 'Jun', revenue: 59000, expenses: 39000, profit: 20000 },
    { month: 'Jul', revenue: 68000, expenses: 42000, profit: 26000 },
  ];

  // Sample department stats
  const departmentData = [
    { name: 'Sales', value: 35 },
    { name: 'Marketing', value: 25 },
    { name: 'Operations', value: 20 },
    { name: 'HR', value: 10 },
    { name: 'IT', value: 10 },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Sample communications metrics
  const communicationsData = [
    { name: 'Emails', count: 245 },
    { name: 'Calls', count: 128 },
    { name: 'Meetings', count: 76 },
    { name: 'Chat', count: 312 },
    { name: 'Video', count: 58 },
  ];

  // Sample tasks and projects
  const activeTasks = [
    { id: 1, title: "Q3 Marketing Campaign", assigned: "Emily Chen", dueDate: "2025-05-15", progress: 75 },
    { id: 2, title: "Customer Survey Analysis", assigned: "David Kim", dueDate: "2025-05-10", progress: 45 },
    { id: 3, title: "New Employee Onboarding", assigned: "Sarah Johnson", dueDate: "2025-05-08", progress: 90 },
    { id: 4, title: "Budget Review Meeting", assigned: "Alex Morgan", dueDate: "2025-05-12", progress: 30 },
  ];

  // Sample recent contacts
  const recentContacts = [
    { id: 1, name: "Jennifer Williams", role: "Sales Manager", image: null, lastContact: "2 hours ago" },
    { id: 2, name: "Michael Brown", role: "Customer", image: null, lastContact: "Yesterday" },
    { id: 3, name: "Rebecca Taylor", role: "Marketing Director", image: null, lastContact: "2 days ago" },
    { id: 4, name: "Thomas Clark", role: "Supplier", image: null, lastContact: "1 week ago" },
  ];

  // Sample stats
  const stats = [
    {
      title: "Total Employees",
      value: "42",
      icon: <UserRoundIcon className="h-6 w-6 text-purple-600" />,
      trend: "+3",
      trendUp: true,
      bg: "bg-purple-100",
    },
    {
      title: "Open Projects",
      value: "16",
      icon: <ClipboardListIcon className="h-6 w-6 text-blue-600" />,
      trend: "+2",
      trendUp: true,
      bg: "bg-blue-100",
    },
    {
      title: "Active Contacts",
      value: "257",
      icon: <UsersIcon className="h-6 w-6 text-green-600" />,
      trend: "+12",
      trendUp: true,
      bg: "bg-green-100",
    },
    {
      title: "Communications",
      value: "843",
      icon: <MessageSquareIcon className="h-6 w-6 text-amber-600" />,
      trend: "+55",
      trendUp: true,
      bg: "bg-amber-100",
    },
  ];

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      {/* Custom header for General Dashboard */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <div className="flex items-center">
            <div className="mr-4 bg-purple-100 p-3 rounded-xl shadow-md text-purple-600">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">General Business Dashboard</h1>
              <p className="text-purple-600 text-sm md:text-base font-medium">Business operations overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className={`text-xs font-medium flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} {stat.trendUp ? '↑' : '↓'}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Metrics Chart */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle>Business Performance</CardTitle>
            <CardDescription>Monthly financial overview</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            View Report
          </Badge>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={businessMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Communications Activity */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Communications Activity</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communicationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Two column layout for tasks and contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Active Tasks</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                View All
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTasks.map(task => (
                <div key={task.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {task.dueDate}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Assigned to: {task.assigned}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-2" />
                    <span className="text-xs font-medium">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Contacts</CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                View All
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {contact.image ? (
                        <AvatarImage src={contact.image} />
                      ) : (
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-800">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{contact.lastContact}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralDashboard;
