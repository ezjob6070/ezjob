import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const StatisticsTab = () => {
  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, jobs: 120 },
    { month: 'Feb', revenue: 52000, jobs: 135 },
    { month: 'Mar', revenue: 48000, jobs: 128 },
    { month: 'Apr', revenue: 61000, jobs: 152 },
    { month: 'May', revenue: 55000, jobs: 145 },
    { month: 'Jun', revenue: 67000, jobs: 168 },
  ];

  const jobTypes = [
    { name: 'Repair', value: 45, color: '#3b82f6' },
    { name: 'Installation', value: 30, color: '#10b981' },
    { name: 'Maintenance', value: 20, color: '#f59e0b' },
    { name: 'Emergency', value: 5, color: '#ef4444' },
  ];

  const regionData = [
    { region: 'North', jobs: 85, revenue: 42000 },
    { region: 'South', jobs: 78, revenue: 38000 },
    { region: 'East', jobs: 92, revenue: 45000 },
    { region: 'West', jobs: 67, revenue: 32000 },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue & Jobs Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Revenue & Jobs Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Jobs'
                  ]}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="revenue" />
                <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={3} name="jobs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Job Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {jobTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Regional Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Bar dataKey="jobs" fill="#3b82f6" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$67,000</div>
              <div className="text-sm text-gray-600">This Month Revenue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">168</div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">$399</div>
              <div className="text-sm text-gray-600">Avg Job Value</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsTab;