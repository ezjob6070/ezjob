
import { Technician } from "@/types/technician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type JobsRevenueComparisonProps = {
  technicians: Technician[];
};

const JobsRevenueComparison = ({ technicians }: JobsRevenueComparisonProps) => {
  // Calculate highest values for scaling
  const highestRevenue = Math.max(...technicians.map(t => t.totalRevenue));
  const highestJobs = Math.max(...technicians.map(t => t.completedJobs));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs vs Revenue Comparison</CardTitle>
        <CardDescription>Analyzing job quantity and revenue generation for active technicians</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {technicians
            .filter(tech => tech.status === "active")
            .sort((a, b) => b.completedJobs - a.completedJobs)
            .slice(0, 6)
            .map((tech) => (
              <div key={tech.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                      {tech.initials}
                    </div>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tech.completedJobs} jobs | ${tech.totalRevenue.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Jobs</span>
                    <span>{Math.round((tech.completedJobs / highestJobs) * 100)}%</span>
                  </div>
                  <Progress value={(tech.completedJobs / highestJobs) * 100} className="h-2 bg-gray-100" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Revenue</span>
                    <span>{Math.round((tech.totalRevenue / highestRevenue) * 100)}%</span>
                  </div>
                  <Progress value={(tech.totalRevenue / highestRevenue) * 100} className="h-2 bg-blue-100" />
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsRevenueComparison;
