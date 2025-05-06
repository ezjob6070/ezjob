import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChartIcon, 
  BriefcaseIcon,
  ListIcon, 
  PlusIcon,
  SearchIcon
} from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToProjectDetail = (id: number) => {
    navigate(`/project/${id}`);
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-3 bg-white shadow-sm">
          <CardHeader className="py-4">
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Quick summary of all project progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <BriefcaseIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                  <div className="text-2xl font-bold">
                    {projects.filter(p => p.status === "In Progress").length}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-md">
                  <BriefcaseIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(projects.reduce((acc, p) => acc + p.budget, 0))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-md">
                  <BriefcaseIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg. Completion</div>
                  <div className="text-2xl font-bold">
                    {Math.round(projects.reduce((acc, p) => acc + p.completion, 0) / projects.length)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="relative mb-4">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-800 rounded-full font-medium">
              {filteredProjects.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
              {filteredProjects.filter(p => p.status === "In Progress").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-medium">
              {filteredProjects.filter(p => p.status === "Completed").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="on-hold">
            On Hold
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full font-medium">
              {filteredProjects.filter(p => p.status === "On Hold").length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {view === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => goToProjectDetail(project.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
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
                      {filteredProjects.map((project) => (
                        <tr 
                          key={project.id} 
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => goToProjectDetail(project.id)}
                        >
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
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {view === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects
                .filter(p => p.status === "In Progress")
                .map((project) => (
                  <Card 
                    key={project.id} 
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => goToProjectDetail(project.id)}
                  >
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
                      {filteredProjects
                        .filter(p => p.status === "In Progress")
                        .map((project) => (
                          <tr 
                            key={project.id} 
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => goToProjectDetail(project.id)}
                          >
                            <td className="p-4 font-medium">{project.name}</td>
                            <td className="p-4 text-gray-600">{project.type}</td>
                            <td className="p-4 text-gray-600">{project.clientName}</td>
                            <td className="p-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
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
          )}
        </TabsContent>

        <TabsContent value="completed">
          {view === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects
                .filter(p => p.status === "Completed")
                .map((project) => (
                  <Card 
                    key={project.id} 
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => goToProjectDetail(project.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
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
                      {filteredProjects
                        .filter(p => p.status === "Completed")
                        .map((project) => (
                          <tr 
                            key={project.id} 
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => goToProjectDetail(project.id)}
                          >
                            <td className="p-4 font-medium">{project.name}</td>
                            <td className="p-4 text-gray-600">{project.type}</td>
                            <td className="p-4 text-gray-600">{project.clientName}</td>
                            <td className="p-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
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
          )}
        </TabsContent>

        <TabsContent value="on-hold">
          {view === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProjects
                .filter(p => p.status === "On Hold")
                .map((project) => (
                  <Card 
                    key={project.id} 
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => goToProjectDetail(project.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
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
                      {filteredProjects
                        .filter(p => p.status === "On Hold")
                        .map((project) => (
                          <tr 
                            key={project.id} 
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => goToProjectDetail(project.id)}
                          >
                            <td className="p-4 font-medium">{project.name}</td>
                            <td className="p-4 text-gray-600">{project.type}</td>
                            <td className="p-4 text-gray-600">{project.clientName}</td>
                            <td className="p-4">
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
