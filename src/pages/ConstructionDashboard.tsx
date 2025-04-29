
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Construction, TruckIcon, LayersIcon, Users, HardHatIcon, 
  CalendarIcon, TrendingUp, ClipboardCheckIcon, AlertTriangle
} from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

const ConstructionDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  // Project completion timeline data
  const projectTimelineData = [
    { name: 'Jan', completed: 2, ongoing: 3, planned: 1 },
    { name: 'Feb', completed: 3, ongoing: 2, planned: 2 },
    { name: 'Mar', completed: 4, ongoing: 3, planned: 2 },
    { name: 'Apr', completed: 2, ongoing: 4, planned: 3 },
    { name: 'May', completed: 3, ongoing: 5, planned: 2 },
    { name: 'Jun', completed: 5, ongoing: 3, planned: 1 },
    { name: 'Jul', completed: 6, ongoing: 2, planned: 3 },
  ];

  // Materials usage data
  const materialsData = [
    { name: 'Concrete', value: 35 },
    { name: 'Steel', value: 25 },
    { name: 'Lumber', value: 18 },
    { name: 'Glass', value: 12 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Equipment utilization data
  const equipmentData = [
    { name: 'Excavator', utilization: 78 },
    { name: 'Bulldozer', utilization: 65 },
    { name: 'Crane', utilization: 83 },
    { name: 'Loader', utilization: 72 },
    { name: 'Dump Truck', utilization: 90 },
  ];

  // Budget tracking data
  const budgetData = [
    { name: 'Jan', budget: 50000, actual: 52000 },
    { name: 'Feb', budget: 60000, actual: 58000 },
    { name: 'Mar', budget: 70000, actual: 75000 },
    { name: 'Apr', budget: 80000, actual: 79000 },
    { name: 'May', budget: 90000, actual: 95000 },
    { name: 'Jun', budget: 100000, actual: 98000 },
    { name: 'Jul', budget: 110000, actual: 108000 },
  ];

  // Safety statistics data
  const safetyData = [
    { name: 'Jan', incidents: 3, nearMisses: 5 },
    { name: 'Feb', incidents: 2, nearMisses: 4 },
    { name: 'Mar', incidents: 1, nearMisses: 7 },
    { name: 'Apr', incidents: 2, nearMisses: 3 },
    { name: 'May', incidents: 0, nearMisses: 4 },
    { name: 'Jun', incidents: 1, nearMisses: 2 },
    { name: 'Jul', incidents: 0, nearMisses: 3 },
  ];

  // Project completion statistics
  const projectStats = {
    totalProjects: 24,
    onSchedule: 18,
    behindSchedule: 6,
    completionRate: 75, // percentage
    averageDelay: 12, // days
  };

  // Key metrics cards
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      description: "Current construction projects",
      icon: <Construction className="h-4 w-4 text-orange-600" />,
      trend: {
        value: "+8%",
        isPositive: true,
      },
      variant: "default",
    },
    {
      title: "Equipment Utilization",
      value: "82%",
      description: "Average equipment usage rate",
      icon: <TruckIcon className="h-4 w-4 text-blue-600" />,
      trend: {
        value: "+5%",
        isPositive: true,
      },
      variant: "default",
    },
    {
      title: "Material Costs",
      value: formatCurrency(458750),
      description: "Total materials expenditure",
      icon: <LayersIcon className="h-4 w-4 text-green-600" />,
      trend: {
        value: "-3%",
        isPositive: true,
      },
      variant: "default",
    },
    {
      title: "Labor Hours",
      value: "2,845",
      description: "Total hours this month",
      icon: <Users className="h-4 w-4 text-purple-600" />,
      trend: {
        value: "+12%",
        isPositive: true,
      },
      variant: "default",
    },
    {
      title: "Project Completion",
      value: "78%",
      description: "Average project progress",
      icon: <ClipboardCheckIcon className="h-4 w-4 text-teal-600" />,
      trend: {
        value: "+4%",
        isPositive: true,
      },
      variant: "default",
    },
    {
      title: "Safety Incidents",
      value: "3",
      description: "Last 30 days",
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      trend: {
        value: "-2",
        isPositive: true,
      },
      variant: "default",
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Custom header for Construction Dashboard */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <div className="flex items-center">
            <div className="mr-4 bg-amber-100 p-3 rounded-xl shadow-md">
              <Construction className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Construction Dashboard</h1>
              <p className="text-amber-600 text-sm md:text-base font-medium">Project management and performance insights</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-blue-50 rounded-md px-3 py-2 flex items-center">
              <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium">
                {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Start date"} - 
                {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "End date"}
              </span>
            </div>
            <div className="bg-green-50 rounded-md px-3 py-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium">Performance: +12%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg px-4 py-3">
            <div className="text-sm text-blue-700 font-medium">Projects On Track</div>
            <div className="text-xl font-bold text-blue-900">18/24</div>
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-3">
            <div className="text-sm text-green-700 font-medium">Budget Utilization</div>
            <div className="text-xl font-bold text-green-900">92%</div>
          </div>
          <div className="bg-amber-50 rounded-lg px-4 py-3">
            <div className="text-sm text-amber-700 font-medium">Contractor Compliance</div>
            <div className="text-xl font-bold text-amber-900">96%</div>
          </div>
          <div className="bg-purple-50 rounded-lg px-4 py-3">
            <div className="text-sm text-purple-700 font-medium">Inspections Passed</div>
            <div className="text-xl font-bold text-purple-900">37/42</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <DashboardMetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Project Timeline with Budget Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectTimelineData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} projects`, '']} />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ongoing" stackId="a" fill="#3b82f6" name="In Progress" radius={[4, 4, 0, 0]} />
                <Bar dataKey="planned" stackId="a" fill="#f59e0b" name="Planned" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Budget vs. Actual</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={budgetData}>
                <defs>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                <Legend />
                <Area type="monotone" dataKey="budget" stroke="#8884d8" fillOpacity={1} fill="url(#colorBudget)" name="Planned Budget" />
                <Area type="monotone" dataKey="actual" stroke="#82ca9d" fillOpacity={1} fill="url(#colorActual)" name="Actual Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Materials and Equipment Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials Usage */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Materials Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Utilization */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Equipment Utilization (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={equipmentData}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Bar 
                  dataKey="utilization" 
                  fill="#0ea5e9" 
                  name="Utilization %" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Safety Metrics */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Site Safety Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" name="Incidents" strokeWidth={2} />
              <Line type="monotone" dataKey="nearMisses" stroke="#f59e0b" name="Near Misses" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionDashboard;
