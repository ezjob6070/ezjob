
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, TrendingUp, Users, CalendarRange } from "lucide-react";

interface LeadValueStatsProps {
  leads: Lead[];
}

const LeadValueStats: React.FC<LeadValueStatsProps> = ({ leads }) => {
  // Calculate key metrics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const averageValue = totalValue / (totalLeads || 1);
  
  // Get this month's leads
  const now = new Date();
  const thisMonthLeads = leads.filter(lead => {
    const createdDate = new Date(lead.createdAt);
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear();
  });
  
  // Group leads by status for the chart
  const statusGroups = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = {
        status: lead.status,
        count: 0,
        value: 0
      };
    }
    acc[lead.status].count += 1;
    acc[lead.status].value += lead.value || 0;
    return acc;
  }, {} as Record<string, {status: string, count: number, value: number}>);
  
  const chartData = Object.values(statusGroups).sort((a, b) => b.value - a.value);
  
  // Colors for different status types
  const statusColors: Record<string, string> = {
    new: "#93c5fd", // blue-300
    contacted: "#c4b5fd", // purple-300
    qualified: "#a5b4fc", // indigo-300
    proposal: "#f9a8d4", // pink-300
    negotiation: "#fcd34d", // amber-300
    won: "#86efac", // green-300
    lost: "#fca5a5", // red-300
    active: "#86efac", // green-300
    inactive: "#d1d5db", // gray-300
    converted: "#93c5fd", // blue-300
    follow: "#fcd34d", // amber-300
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Lead Value</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalLeads} active leads
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageValue)}</div>
          <p className="text-xs text-muted-foreground">
            Per lead on average
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <CalendarRange className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthLeads.length}</div>
          <p className="text-xs text-muted-foreground">
            Worth {formatCurrency(thisMonthLeads.reduce((sum, lead) => sum + (lead.value || 0), 0))}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">By Status</CardTitle>
          <Users className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="status" 
                tick={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => label.charAt(0).toUpperCase() + label.slice(1)}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.status] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadValueStats;
