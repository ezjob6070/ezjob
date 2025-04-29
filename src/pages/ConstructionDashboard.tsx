
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Construction, TruckIcon, LayersIcon, Users, HardHatIcon } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

const ConstructionDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  // Sample project data
  const projectData = [
    { name: 'Jan', completed: 2, ongoing: 3, planned: 1 },
    { name: 'Feb', completed: 3, ongoing: 2, planned: 2 },
    { name: 'Mar', completed: 4, ongoing: 3, planned: 2 },
    { name: 'Apr', completed: 2, ongoing: 4, planned: 3 },
    { name: 'May', completed: 3, ongoing: 5, planned: 2 },
    { name: 'Jun', completed: 5, ongoing: 3, planned: 1 },
    { name: 'Jul', completed: 6, ongoing: 2, planned: 3 },
  ];

  // Sample materials usage
  const materialsData = [
    { name: 'Concrete', value: 35 },
    { name: 'Steel', value: 25 },
    { name: 'Lumber', value: 18 },
    { name: 'Glass', value: 12 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Equipment utilization
  const equipmentData = [
    { name: 'Excavator', utilization: 78 },
    { name: 'Bulldozer', utilization: 65 },
    { name: 'Crane', utilization: 83 },
    { name: 'Loader', utilization: 72 },
    { name: 'Dump Truck', utilization: 90 },
  ];

  // Sample stats
  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: <Construction className="h-6 w-6 text-orange-600" />,
      trend: "+2",
      trendUp: true,
      bg: "bg-orange-100",
      text: "text-orange-800",
    },
    {
      title: "Equipment In Use",
      value: "24",
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />,
      trend: "+3",
      trendUp: true,
      bg: "bg-blue-100",
      text: "text-blue-800",
    },
    {
      title: "Material Orders",
      value: "38",
      icon: <LayersIcon className="h-6 w-6 text-green-600" />,
      trend: "-5",
      trendUp: false,
      bg: "bg-green-100",
      text: "text-green-800",
    },
    {
      title: "Contractors",
      value: "47",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      trend: "+4",
      trendUp: true,
      bg: "bg-purple-100",
      text: "text-purple-800",
    },
    {
      title: "Safety Incidents",
      value: "3",
      icon: <HardHatIcon className="h-6 w-6 text-red-600" />,
      trend: "-2",
      trendUp: true,
      bg: "bg-red-100",
      text: "text-red-800",
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Custom header for Construction Dashboard */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <div className="flex items-center">
            <div className="mr-4 bg-orange-100 p-3 rounded-xl shadow-md text-orange-600">
              <Construction className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Construction Dashboard</h1>
              <p className="text-orange-600 text-sm md:text-base font-medium">Project management and analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <h3 className={`text-2xl font-bold ${stat.text}`}>{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Status Chart */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
              <Bar dataKey="ongoing" stackId="a" fill="#3b82f6" name="In Progress" />
              <Bar dataKey="planned" stackId="a" fill="#f59e0b" name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two smaller charts in one row */}
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="#0ea5e9" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionDashboard;
