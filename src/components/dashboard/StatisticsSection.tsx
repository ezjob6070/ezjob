
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
  
  // Jobs overview data for pie chart
  const jobsOverviewData = [
    { name: 'In Progress', value: 22, color: '#4CC9F0', label: 'In Progress (22)' },
    { name: 'Cancelled', value: 8, color: '#F77F00', label: 'Cancelled (8)' },
    { name: 'Completed', value: 11, color: '#8338EC', label: 'Completed (11)' },
  ];
  
  // Jobs by area data for pie chart
  const jobsByAreaData = [
    { name: 'North', value: 27, color: '#8B5CF6', label: '(27)' },
  ];
  
  // Technicians with highest cancelling jobs data
  const techniciansCancellingData = [
    { name: 'Car Detailing Raleigh', value: 12, color: '#8B5CF6', label: 'Car Detailing Raleigh (12)' },
    { name: 'Philadelphia', value: 6, color: '#F77F00', label: 'Philadelphia 1 (6)' },
  ];
  
  // Technicians with highest completed jobs data
  const techniciansCompletedData = [
    { name: 'Virginia & DC & Milland', value: 11, color: '#F472B6', label: 'Virginia & DC & Milland 1 (11)' },
  ];
  
  // Job sources by sales amount data
  const jobSourcesSalesData = [
    { name: 'center 123', value: 37, color: '#F77F00', label: 'center 123 (37)' },
  ];
  
  // Job sources by done jobs data
  const jobSourcesDoneData = [
    { name: 'center 123', value: 41, color: '#F472B6', label: 'center 123 (41)' },
  ];

  // Monthly revenue data for bar chart
  const monthlyRevenueData = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 26 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 43 },
    { month: 'Jun', value: 25 },
    { month: 'Jul', value: 23 },
    { month: 'Aug', value: 19 },
    { month: 'Sep', value: 23 },
    { month: 'Oct', value: 21 },
    { month: 'Nov', value: 24 },
    { month: 'Dec', value: 17 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jobs Overview */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Jobs Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={jobsOverviewData} 
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {jobsOverviewData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.name} ({item.value})</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Jobs by Area */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Jobs by Area</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={jobsByAreaData}
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {jobsByAreaData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.name} {item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technicians with highest cancelling jobs */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Technicians with highest cancelling jobs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={techniciansCancellingData}
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {techniciansCancellingData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Technicians with highest completed jobs */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Technicians with highest completed jobs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={techniciansCompletedData}
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {techniciansCompletedData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Sources By Sales Amount */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Job Sources By Sales Amount</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={jobSourcesSalesData}
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {jobSourcesSalesData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Job Sources By Done Jobs */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-base font-medium">Job Sources By Done Jobs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-6 pb-6 flex items-center">
            <div className="flex-1">
              <EnhancedDonutChart 
                data={jobSourcesDoneData}
                title=""
                subtitle=""
                size={200}
                thickness={30}
                gradients={false}
                legendPosition="right"
              />
            </div>
            <div className="flex-1">
              <ul className="space-y-2">
                {jobSourcesDoneData.map((item) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Company's Cuts By Last 12 Months */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="py-4 px-6">
          <CardTitle className="text-base font-medium">Company's Cuts By Last 12 Months</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-6 pb-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsSection;
