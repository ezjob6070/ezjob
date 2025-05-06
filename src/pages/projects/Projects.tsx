
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, ListIcon, BarChartIcon } from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<'cards' | 'list'>('cards');
  
  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };

  // Calculate project stats by status
  const allProjects = projects;
  const inProgressProjects = projects.filter(p => p.status === "In Progress");
  const completedProjects = projects.filter(p => p.status === "Completed");
  const notStartedProjects = projects.filter(p => p.status === "Not Started");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
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

      {/* Project overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total projects in the system
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Projects currently being worked on
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Successfully finished projects
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedProjects.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Projects in planning phase
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ProjectsDisplay projects={allProjects} view={view} />
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-0">
          <ProjectsDisplay projects={inProgressProjects} view={view} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <ProjectsDisplay projects={completedProjects} view={view} />
        </TabsContent>
        
        <TabsContent value="not-started" className="mt-0">
          <ProjectsDisplay projects={notStartedProjects} view={view} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ProjectsDisplay component to show either cards or list view
function ProjectsDisplay({ projects, view }: { projects: Project[], view: 'cards' | 'list' }) {
  if (projects.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No projects found</p>;
  }
  
  return view === 'cards' ? (
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
  ) : (
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
  );
}
