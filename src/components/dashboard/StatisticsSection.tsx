
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EnhancedDonutChart } from "@/components/EnhancedDonutChart";

type StatisticsSectionProps = {
  revenueData: any[];
  jobTypeData: any[];
  performanceData: any[];
  formatCurrency: (amount: number) => string;
};

const StatisticsSection = ({
  revenueData,
  jobTypeData,
  performanceData,
  formatCurrency
}: StatisticsSectionProps) => {
  // Colors for charts
  const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
  
  // Enhanced job status data for donut chart
  const jobStatusData = [
    { name: 'Completed', value: 42, color: '#10b981', gradientFrom: '#059669', gradientTo: '#34d399' },
    { name: 'In Progress', value: 28, color: '#0ea5e9', gradientFrom: '#0284c7', gradientTo: '#38bdf8' },
    { name: 'Scheduled', value: 18, color: '#f59e0b', gradientFrom: '#d97706', gradientTo: '#fbbf24' },
    { name: 'Cancelled', value: 8, color: '#ef4444', gradientFrom: '#dc2626', gradientTo: '#f87171' },
  ];
  
  // Jobs by area data for donut chart
  const jobsByAreaData = [
    { name: 'North', value: 35, color: '#4f46e5', gradientFrom: '#4338ca', gradientTo: '#818cf8' },
    { name: 'South', value: 25, color: '#0ea5e9', gradientFrom: '#0369a1', gradientTo: '#38bdf8' },
    { name: 'East', value: 22, color: '#10b981', gradientFrom: '#059669', gradientTo: '#34d399' },
    { name: 'West', value: 18, color: '#f59e0b', gradientFrom: '#d97706', gradientTo: '#fbbf24' },
  ];
  
  // Technician performance data
  const technicianPerformanceData = [
    { name: 'Michael', jobs: 24, efficiency: 96 },
    { name: 'Sarah', jobs: 18, efficiency: 92 },
    { name: 'David', jobs: 16, efficiency: 88 },
    { name: 'Emily', jobs: 14, efficiency: 94 },
    { name: 'Robert', jobs: 12, efficiency: 90 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Job Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 h-[350px]">
            <EnhancedDonutChart 
              data={jobStatusData} 
              title={jobStatusData.reduce((acc, item) => acc + item.value, 0).toString()}
              subtitle="Total Jobs"
              size={280}
              thickness={50}
              gradients={true}
              legendPosition="right"
            />
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Jobs by Area</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 h-[350px]">
            <EnhancedDonutChart
              data={jobsByAreaData}
              title={jobsByAreaData.reduce((acc, item) => acc + item.value, 0).toString()}
              subtitle="Total Jobs"
              size={280}
              thickness={50}
              gradients={true}
              legendPosition="right"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(Number(value))} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']} 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }} 
                  activeDot={{ stroke: '#4f46e5', strokeWidth: 2, r: 6 }} 
                  name="Revenue" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }} 
                  name="Target" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Technician Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={technicianPerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
                />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                <Bar dataKey="efficiency" name="Efficiency %" barSize={20} fill="#4f46e5">
                  {
                    technicianPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#4f46e5${Math.round((entry.efficiency / 100) * 255).toString(16).padStart(2, '0')}`} />
                    ))
                  }
                </Bar>
                <Bar dataKey="jobs" name="Completed Jobs" barSize={20} fill="#10b981">
                  {
                    technicianPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`#10b981`} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsSection;
