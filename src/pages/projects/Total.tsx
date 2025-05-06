
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChartIcon, 
  BriefcaseIcon, 
  BuildingIcon, 
  CalendarIcon, 
  CircleCheckIcon,
  CircleClockIcon,
  ClockIcon, 
  FolderIcon, 
  TagIcon, 
  Users2Icon
} from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

export default function ProjectsTotal() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  
  // Calculate statistics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.actualSpent, 0);
  const avgCompletion = Math.round(projects.reduce((acc, p) => acc + p.completion, 0) / projects.length);
  
  // Count projects by status
  const inProgressCount = projects.filter(p => p.status === "In Progress").length;
  const completedCount = projects.filter(p => p.status === "Completed").length;
  const notStartedCount = projects.filter(p => p.status === "Not Started").length;
  const onHoldCount = projects.filter(p => p.status === "On Hold").length;
  
  // Count by project type
  const projectTypes = projects.reduce((acc, project) => {
    acc[project.type] = (acc[project.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort project types by count
  const sortedProjectTypes = Object.entries(projectTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Summary</h1>
        <p className="text-muted-foreground">Overall statistics and metrics for all projects</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Projects</CardDescription>
            <CardTitle className="text-3xl">{projects.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {inProgressCount} currently in progress
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Budget</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalBudget)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(totalSpent)} spent ({Math.round((totalSpent / totalBudget) * 100)}%)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Completion</CardDescription>
            <CardTitle className="text-3xl">{avgCompletion}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {completedCount} projects completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Project Types</CardDescription>
            <CardTitle className="text-3xl">{Object.keys(projectTypes).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {Object.keys(projectTypes).length} different categories
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{inProgressCount}</span>
                  <span className="text-muted-foreground ml-1">({Math.round((inProgressCount / projects.length) * 100)}%)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{completedCount}</span>
                  <span className="text-muted-foreground ml-1">({Math.round((completedCount / projects.length) * 100)}%)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Not Started</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{notStartedCount}</span>
                  <span className="text-muted-foreground ml-1">({Math.round((notStartedCount / projects.length) * 100)}%)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span>On Hold</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{onHoldCount}</span>
                  <span className="text-muted-foreground ml-1">({Math.round((onHoldCount / projects.length) * 100)}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Project Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedProjectTypes.map(([type, count], index) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${
                      ['blue', 'green', 'amber', 'purple', 'pink'][index % 5]
                    }-500 mr-2`}></div>
                    <span>{type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{count}</span>
                    <span className="text-muted-foreground ml-1">({Math.round((count / projects.length) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Project Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-md">
                <Users2Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Workers</div>
                <div className="text-xl font-bold">{projects.reduce((acc, p) => acc + p.workers, 0)}</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-md">
                <BuildingIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Unique Clients</div>
                <div className="text-xl font-bold">
                  {new Set(projects.map(p => p.clientName)).size}
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-md">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Duration</div>
                <div className="text-xl font-bold">
                  {Math.round(projects.reduce((acc, p) => {
                    const startDate = new Date(p.startDate);
                    const endDate = new Date(p.expectedEndDate);
                    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                    return acc + days;
                  }, 0) / projects.length)} days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
