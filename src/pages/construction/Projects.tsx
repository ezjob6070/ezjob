
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConstructionIcon, Building2, CalendarIcon, DollarSignIcon, Users2Icon } from "lucide-react";
import { useState } from "react";

const dummyProjects = [
  {
    id: "proj-001",
    name: "City Center Tower",
    client: "Metropolis Development Corp",
    budget: 4500000,
    startDate: "2025-05-15",
    endDate: "2026-12-30", 
    status: "active",
    completion: 23,
    location: "Downtown, Metro City",
    type: "Commercial"
  },
  {
    id: "proj-002",
    name: "Riverfront Residences",
    client: "Green Valley Properties",
    budget: 2800000,
    startDate: "2025-06-20",
    endDate: "2026-09-15",
    status: "planning",
    completion: 5,
    location: "North Riverside, Metro City",
    type: "Residential"
  },
  {
    id: "proj-003",
    name: "Metro Hospital Expansion",
    client: "City Healthcare System",
    budget: 5200000,
    startDate: "2025-04-10",
    endDate: "2026-11-20",
    status: "active",
    completion: 41,
    location: "Eastside, Metro City",
    type: "Healthcare"
  }
];

const Projects = () => {
  const [filter, setFilter] = useState("all");
  
  const filteredProjects = filter === "all" 
    ? dummyProjects 
    : dummyProjects.filter(project => project.status === filter);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construction Projects</h1>
          <p className="text-muted-foreground">Manage and monitor your ongoing construction projects</p>
        </div>
        <Button>
          <ConstructionIcon className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyProjects.filter(p => p.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dummyProjects.reduce((sum, proj) => sum + proj.budget, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter("all")}>All Projects</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter("active")}>Active</TabsTrigger>
          <TabsTrigger value="planning" onClick={() => setFilter("planning")}>Planning</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter("completed")}>Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map(project => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.location}</CardDescription>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 
                  project.status === 'planning' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{project.type}</span>
                </div>
                <div className="flex items-center">
                  <Users2Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{project.client}</span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-1">Completion: {project.completion}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.completion}%` }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projects;
