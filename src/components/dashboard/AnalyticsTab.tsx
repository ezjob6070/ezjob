import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar } from "lucide-react";

const AnalyticsTab = () => {
  // Sample analytics data
  const performanceData = [
    { month: 'Jan', calls: 450, jobs: 320, conversion: 71 },
    { month: 'Feb', calls: 520, jobs: 380, conversion: 73 },
    { month: 'Mar', calls: 480, jobs: 350, conversion: 73 },
    { month: 'Apr', calls: 610, jobs: 445, conversion: 73 },
    { month: 'May', calls: 580, jobs: 420, conversion: 72 },
    { month: 'Jun', calls: 670, jobs: 490, conversion: 73 },
  ];

  const customerMetrics = [
    { metric: 'New Customers', value: 156, change: '+12%', trend: 'up' },
    { metric: 'Repeat Customers', value: 89, change: '+8%', trend: 'up' },
    { metric: 'Customer Retention', value: 87, change: '-2%', trend: 'down' },
    { metric: 'Avg Response Time', value: 24, change: '-15%', trend: 'up' },
  ];

  const timeData = [
    { hour: '8AM', jobs: 12 },
    { hour: '10AM', jobs: 18 },
    { hour: '12PM', jobs: 25 },
    { hour: '2PM', jobs: 22 },
    { hour: '4PM', jobs: 15 },
    { hour: '6PM', jobs: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Call to Job Conversion Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'calls' ? 'Calls' : name === 'jobs' ? 'Jobs' : 'Conversion %'
                  ]}
                />
                <Area type="monotone" dataKey="calls" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="jobs" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{metric.metric}</div>
                    <div className="text-2xl font-bold">{metric.value}{metric.metric.includes('Time') ? 'h' : metric.metric.includes('Retention') ? '%' : ''}</div>
                  </div>
                  <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="ml-1 font-medium">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm">Conversion Rate</div>
                <div className="text-3xl font-bold">73.2%</div>
                <div className="text-blue-200 text-sm">+2.1% from last month</div>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-100 text-sm">Efficiency Score</div>
                <div className="text-3xl font-bold">91.8%</div>
                <div className="text-green-200 text-sm">+5.3% from last month</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-100 text-sm">Avg Booking Time</div>
                <div className="text-3xl font-bold">2.4 days</div>
                <div className="text-purple-200 text-sm">-0.3 days improved</div>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;