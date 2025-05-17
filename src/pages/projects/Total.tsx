
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, BarChartIcon, Building, CircleCheck, Clock, ListIcon, PlusIcon, TrendingUp } from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";

export default function ProjectsTotal() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<'cards' | 'list'>('list');
  
  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };

  // Calculate project stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "Completed").length;
  const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
  const completionRate = totalProjects ? Math.round((projects.reduce((sum, p) => sum + p.completion, 0) / totalProjects)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Total Projects</h1>
          <p className="text-muted-foreground">Overview of all completed and in-progress projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-md p-1 flex">
            <button 
              className={`p-1.5 rounded ${view === 'cards' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setView('cards')}
              title="Card view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <BarChartIcon className="w-4 h-4" />
            </button>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
            onClick={handleCreateProject}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Updated to match ProjectsDashboardSection styling */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-purple-700">Total Projects</span>
            <div className="p-1.5 bg-purple-100 rounded-full">
              <Building className="h-3.5 w-3.5 text-purple-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-800">{totalProjects}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-green-700">Completed</span>
            <div className="p-1.5 bg-green-100 rounded-full">
              <CircleCheck className="h-3.5 w-3.5 text-green-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-green-800">{completedProjects}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-blue-700">In Progress</span>
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-800">{inProgressProjects}</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-amber-700">Total Value</span>
            <div className="p-1.5 bg-amber-100 rounded-full">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-800">{formatCurrency(projects.reduce((acc, p) => acc + p.budget, 0))}</div>
        </div>
      </div>
      
      {view === 'list' ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Project Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Progress</th>
                    <th className="text-right p-4">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{project.name}</td>
                      <td className="p-4 text-gray-600">{project.type}</td>
                      <td className="p-4 text-gray-600">{project.clientName}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === "In Progress" 
                            ? "bg-blue-100 text-blue-700" 
                            : project.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-100 rounded-full">
                            <div 
                              className="h-full rounded-full bg-blue-500" 
                              style={{ width: `${project.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{project.completion}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">{formatCurrency(project.budget)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === "In Progress" 
                      ? "bg-blue-100 text-blue-700" 
                      : project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{project.type}</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-full rounded-full bg-blue-500" 
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{project.completion}% complete</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Client: {project.clientName}</span>
                    <span className="font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
