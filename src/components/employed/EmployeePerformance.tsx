
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Employee, PerformanceMetric } from "@/types/employee";
import { format, isValid, parseISO } from "date-fns";
import { 
  BarChart, 
  Star, 
  Award, 
  Clock, 
  Calendar, 
  TrendingUp, 
  CheckCircle2
} from "lucide-react";

interface EmployeePerformanceProps {
  employee: Employee;
}

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ employee }) => {
  // Generate some sample metrics if none exist
  const performanceMetrics = employee.performanceMetrics || [
    { 
      id: "metric-1", 
      metricName: "Productivity", 
      value: 85, 
      maxValue: 100, 
      date: new Date().toISOString() 
    },
    { 
      id: "metric-2", 
      metricName: "Quality of Work", 
      value: 90, 
      maxValue: 100, 
      date: new Date().toISOString() 
    },
    { 
      id: "metric-3", 
      metricName: "Teamwork", 
      value: 95, 
      maxValue: 100, 
      date: new Date().toISOString() 
    },
    { 
      id: "metric-4", 
      metricName: "Communication", 
      value: 80, 
      maxValue: 100, 
      date: new Date().toISOString() 
    },
  ];

  const attendanceRate = employee.attendanceRate || 95;
  const completedProjects = employee.completedProjects || 12;
  const activeProjects = employee.activeProjects || 3;
  const totalHoursLogged = employee.totalHoursLogged || 1840;
  const lastReviewDate = employee.lastReviewDate;
  const nextReviewDate = employee.nextReviewDate;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not scheduled";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };
  
  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-green-500";
    if (value >= 70) return "bg-blue-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Performance Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{employee.performanceRating || 4.2}</div>
              <div className="text-xl">/5</div>
            </div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${
                    i < Math.floor(employee.performanceRating || 4.2)
                      ? "text-yellow-500 fill-yellow-500" 
                      : i < (employee.performanceRating || 4.2) 
                        ? "text-yellow-500 fill-yellow-500 opacity-50" 
                        : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <Progress
              value={attendanceRate}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Hours Logged (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHoursLogged}</div>
            <p className="text-xs text-muted-foreground mt-1">Expected: 2080</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Project Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Projects Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Completed</div>
                    <div className="text-2xl font-bold">{completedProjects}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Active</div>
                    <div className="text-2xl font-bold">{activeProjects}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Review Schedule</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last Review:</span>
                  </div>
                  <Badge variant="outline">{formatDate(lastReviewDate)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Next Review:</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    {formatDate(nextReviewDate)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{metric.metricName}</span>
                  <span className="text-sm font-semibold">
                    {metric.value}/{metric.maxValue}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.maxValue) * 100} 
                  className={`h-2 ${getProgressColor((metric.value / metric.maxValue) * 100)}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills & Expertise */}
      {employee.skills && employee.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeePerformance;
