
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { BriefcaseIcon, FolderIcon, PlusIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";

export default function ProjectsInProgress() {
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.filter(project => project.status === "In Progress")
  );

  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">In Progress Projects</h1>
          <p className="text-muted-foreground">Current active projects that are being worked on</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
          onClick={handleCreateProject}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-3 bg-white shadow-sm">
          <CardHeader className="py-4">
            <CardTitle>In Progress Overview</CardTitle>
            <CardDescription>Quick summary of current project progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                  <div className="text-2xl font-bold">{projects.length}</div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-md">
                  <FolderIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg. Completion</div>
                  <div className="text-2xl font-bold">
                    {Math.round(projects.reduce((acc, p) => acc + p.completion, 0) / projects.length)}%
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-md">
                  <FolderIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(projects.reduce((acc, p) => acc + p.budget, 0))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {project.status}
                </span>
              </div>
              <CardDescription>{project.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Progress</div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full rounded-full bg-blue-500" 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{project.completion}% complete</span>
                    <span>Budget: {formatCurrency(project.budget)}</span>
                  </div>
                </div>
                
                <div className="pt-2 text-sm text-gray-500">
                  Client: {project.clientName}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
