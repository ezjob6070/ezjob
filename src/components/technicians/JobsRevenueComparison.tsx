
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Technician } from "@/types/technician";

export interface JobsRevenueComparisonProps {
  technicians: Technician[];
}

const JobsRevenueComparison: React.FC<JobsRevenueComparisonProps> = ({ technicians }) => {
  // Function to calculate average revenue per job
  const getAverageRevenuePerJob = (tech: Technician) => {
    if (tech.completedJobs === 0) return 0;
    return tech.totalRevenue / tech.completedJobs;
  };

  // Process the data for the chart
  const chartData = technicians.map(tech => ({
    name: tech.name,
    completedJobs: tech.completedJobs,
    cancelledJobs: tech.cancelledJobs,
    averageRevenue: getAverageRevenuePerJob(tech)
  }));

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Jobs & Revenue Comparison</CardTitle>
        <CardDescription>Jobs completed and average revenue per job</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "averageRevenue") {
                    return [`$${value.toFixed(2)}`, "Avg Revenue per Job"];
                  }
                  return [value, name === "completedJobs" ? "Completed Jobs" : "Cancelled Jobs"];
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="completedJobs"
                fill="#3b82f6"
                name="Completed Jobs"
              />
              <Bar
                yAxisId="left"
                dataKey="cancelledJobs"
                fill="#f43f5e"
                name="Cancelled Jobs"
              />
              <Bar
                yAxisId="right"
                dataKey="averageRevenue"
                fill="#10b981"
                name="Avg Revenue per Job"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsRevenueComparison;
