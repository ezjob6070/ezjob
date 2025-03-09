
import { Technician } from "@/types/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type TopRevenueTechniciansChartProps = {
  technicians: Technician[];
};

const TopRevenueTechniciansChart = ({ technicians }: TopRevenueTechniciansChartProps) => {
  // Calculate highest revenue for scaling
  const highestRevenue = Math.max(...technicians.map(t => t.totalRevenue));

  // Get top 5 technicians by revenue
  const topTechnicians = [...technicians]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Top 5 Technicians by Revenue</CardTitle>
        <CardDescription>Performance comparison of your highest earning technicians</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topTechnicians.map((tech, index) => (
            <div key={tech.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-${index === 0 ? 'amber' : index === 1 ? 'blue' : 'emerald'}-${600 - index * 100} flex items-center justify-center text-white`}>
                    {tech.initials}
                  </div>
                  <span>{tech.name}</span>
                </div>
                <span className="font-medium">${tech.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(tech.totalRevenue / highestRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopRevenueTechniciansChart;
