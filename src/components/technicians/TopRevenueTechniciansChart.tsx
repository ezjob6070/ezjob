
import { Technician } from "@/types/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

type TopRevenueTechniciansChartProps = {
  technicians: Technician[];
};

const TopRevenueTechniciansChart = ({ technicians }: TopRevenueTechniciansChartProps) => {
  // Check if there are any technicians
  if (!technicians || technicians.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 5 Technicians by Revenue</CardTitle>
          <CardDescription>No technician data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32 text-gray-500">
            No technician data available to display. Add technicians to see performance metrics.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if any technicians have revenue
  const techniciansWithRevenue = technicians.filter(t => t.totalRevenue && t.totalRevenue > 0);
  
  if (techniciansWithRevenue.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 5 Technicians by Revenue</CardTitle>
          <CardDescription>No revenue data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32 text-gray-500">
            No revenue data available yet. Complete jobs to see technician revenue metrics.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate highest revenue for scaling
  const highestRevenue = Math.max(...technicians.map(t => t.totalRevenue || 0));

  // Get top 5 technicians by revenue
  const topTechnicians = [...technicians]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Top 5 Technicians by Revenue</CardTitle>
        <CardDescription>Performance comparison of your highest earning technicians</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTechnicians.map((tech, index) => {
            // Ensure initials are available
            const techInitials = tech.initials || (tech.name ? getInitials(tech.name) : "N/A");
            const revenue = tech.totalRevenue || 0;
            
            return (
              <div key={tech.id || index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-${index === 0 ? 'amber' : index === 1 ? 'blue' : 'emerald'}-${600 - index * 100} flex items-center justify-center text-white`}>
                      {techInitials}
                    </div>
                    <span>{tech.name || "Unnamed Technician"}</span>
                  </div>
                  <span className="font-medium">${revenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                    style={{ width: `${highestRevenue > 0 ? (revenue / highestRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopRevenueTechniciansChart;
