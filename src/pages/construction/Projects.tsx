
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Truck, PlusIcon } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

export default function Projects() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleAddProject = (data: any) => {
    const newProject: Project = {
      id: projects.length + 1,
      name: data.name,
      type: data.type,
      description: data.description || "",
      location: data.location,
      completion: 0,
      workers: Math.floor(Math.random() * 30) + 20,
      vehicles: Math.floor(Math.random() * 10) + 5,
      status: "Not Started",
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 14)).toISOString().split('T')[0],
      budget: Math.floor(Math.random() * 20000000) + 5000000,
      actualSpent: 0,
      clientName: data.clientName || "New Client"
    };
    
    setProjects([...projects, newProject]);
    toast.success("New project added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construction Projects</h1>
          <p className="text-muted-foreground">Manage and track all your construction projects</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{project.name}</CardTitle>
                <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">{project.status}</div>
              </div>
              <CardDescription>{project.type} - {project.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{project.completion}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.completion}%` }}></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Budget: {formatCurrency(project.budget)}
                </div>
                <div className="flex justify-between pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Construction className="h-3.5 w-3.5" />
                    <span>{project.workers} Workers</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>{project.vehicles} Vehicles</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddConstructionItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="project"
        onSubmit={handleAddProject}
      />
    </div>
  );
}
