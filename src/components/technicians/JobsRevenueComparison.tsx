
import { Technician } from "@/types/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type JobsRevenueComparisonProps = {
  technicians: Technician[];
};

const JobsRevenueComparison = ({ technicians }: JobsRevenueComparisonProps) => {
  // Check if there are any technicians
  if (!technicians || technicians.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jobs vs Revenue Comparison</CardTitle>
          <CardDescription>No technician data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex justify-center items-center text-gray-500">
          Add technicians to see performance comparison
        </CardContent>
      </Card>
    );
  }

  // Get top 5 technicians by total jobs for comparison
  const topTechnicians = [...technicians]
    .sort((a, b) => ((b.completedJobs || 0) + (b.cancelledJobs || 0)) - ((a.completedJobs || 0) + (a.cancelledJobs || 0)))
    .slice(0, 5);

  // Format the data for the chart
  const chartData = topTechnicians.map(tech => ({
    name: tech.name || "Unnamed",
    completedJobs: tech.completedJobs || 0,
    cancelledJobs: tech.cancelledJobs || 0,
    revenue: tech.totalRevenue || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs vs Revenue Comparison</CardTitle>
        <CardDescription>Analysis of job completion rate and revenue generation</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="completedJobs" name="Completed Jobs" fill="#8884d8" />
            <Bar yAxisId="left" dataKey="cancelledJobs" name="Cancelled Jobs" fill="#ff8042" />
            <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default JobsRevenueComparison;
