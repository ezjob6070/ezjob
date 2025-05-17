
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { BriefcaseIcon, Clock, FolderIcon, TrendingUp } from "lucide-react";
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
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Updated to match ProjectsDashboardSection styling */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-purple-700">Total Projects</span>
            <div className="p-1.5 bg-purple-100 rounded-full">
              <BriefcaseIcon className="h-3.5 w-3.5 text-purple-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-800">{projects.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-blue-700">In Progress</span>
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-800">{projects.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-emerald-700">Avg. Completion</span>
            <div className="p-1.5 bg-emerald-100 rounded-full">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-800">
            {Math.round(projects.reduce((acc, p) => acc + p.completion, 0) / projects.length)}%
          </div>
        </div>
      </div>

      <Card className="col-span-1 md:col-span-3 bg-white shadow-sm">
        <CardHeader className="py-4">
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Active projects overview</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
