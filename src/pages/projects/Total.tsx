
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, CircleIcon } from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";

export default function ProjectsTotal() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };

  // Calculate statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
  const plannedProjects = projects.filter(p => p.status === "Planned").length;
  
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const completedBudget = projects
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.budget, 0);
  const inProgressBudget = projects
    .filter(p => p.status === "In Progress")
    .reduce((sum, p) => sum + p.budget, 0);
  
  const avgCompletion = Math.round(
    projects.reduce((acc, p) => acc + p.completion, 0) / projects.length
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Total Projects</h1>
          <p className="text-muted-foreground">Overall statistics for all projects</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
          onClick={handleCreateProject}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedProjects} completed, {inProgressProjects} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(completedBudget)} completed, {formatCurrency(inProgressBudget)} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletion}%</div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
              <div 
                className="h-full rounded-full bg-blue-500" 
                style={{ width: `${avgCompletion}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <CircleIcon className="h-3 w-3 fill-green-500 text-green-500" />
              <span className="text-sm">Completed: {completedProjects}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <CircleIcon className="h-3 w-3 fill-blue-500 text-blue-500" />
              <span className="text-sm">In Progress: {inProgressProjects}</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleIcon className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="text-sm">Planned: {plannedProjects}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Project Completion Timeline</CardTitle>
          <CardDescription>Timeline showing completion status of all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-0.5 bg-gray-200"></div>
            
            {projects
              .sort((a, b) => (b.completion - a.completion))
              .slice(0, 5)
              .map((project, index) => (
                <div key={project.id} className="relative mb-8 last:mb-0">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      project.status === "Completed" 
                        ? "bg-green-100 text-green-600" 
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-amber-100 text-amber-600"
                    } z-10`}>
                      <CircleIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 ml-4 p-4 bg-gray-50 rounded-md shadow-sm">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{project.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === "Completed" 
                            ? "bg-green-100 text-green-700" 
                            : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Client: {project.clientName}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{project.completion}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full">
                          <div 
                            className="h-full rounded-full bg-blue-500" 
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
            <CardDescription>Budget allocation across project types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Website Development', 'Mobile App', 'UI/UX Design', 'Other'].map((type) => {
                const typeProjects = projects.filter(p => p.type === type);
                const typeBudget = typeProjects.reduce((sum, p) => sum + p.budget, 0);
                const percentage = Math.round((typeBudget / totalBudget) * 100) || 0;
                
                return (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{type}</span>
                      <span className="text-sm">{formatCurrency(typeBudget)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-full rounded-full bg-blue-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{typeProjects.length} projects</span>
                      <span className="text-xs text-gray-500">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Project Managers</CardTitle>
            <CardDescription>Performance overview of project managers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['Alex Johnson', 'Sarah Miller', 'David Chen'].map((manager, index) => {
                const managerProjects = Math.floor(Math.random() * 10) + 5;
                const completion = Math.floor(Math.random() * 30) + 70;
                
                return (
                  <div key={manager}>
                    <div className="flex justify-between mb-1">
                      <div>
                        <h3 className="text-sm font-medium">{manager}</h3>
                        <p className="text-xs text-gray-500">{managerProjects} projects</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{completion}%</span>
                        <p className="text-xs text-gray-500">avg. completion</p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                      <div 
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`} 
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
