
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHatIcon, Construction, Truck, PlusIcon } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";

interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  completion: number;
  workers: number;
  vehicles: number;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
}

export default function Projects() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "City Center Tower",
      type: "Commercial Building",
      description: "Phase 1",
      location: "Downtown",
      completion: 30,
      workers: 6,
      vehicles: 3,
      status: "In Progress"
    },
    {
      id: 2,
      name: "City Center Tower",
      type: "Commercial Building",
      description: "Phase 2",
      location: "Downtown",
      completion: 60,
      workers: 7,
      vehicles: 4,
      status: "In Progress"
    },
    {
      id: 3,
      name: "City Center Tower",
      type: "Commercial Building",
      description: "Phase 3",
      location: "Downtown",
      completion: 90,
      workers: 8,
      vehicles: 5,
      status: "In Progress"
    }
  ]);

  const handleAddProject = (data: any) => {
    const newProject: Project = {
      id: projects.length + 1,
      name: data.name,
      type: data.type,
      description: data.description || "",
      location: data.location,
      completion: 0,
      workers: 5,
      vehicles: 2,
      status: "Not Started"
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
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{project.name}</CardTitle>
                <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">{project.status}</div>
              </div>
              <CardDescription>{project.type} - {project.description}</CardDescription>
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
                <div className="flex justify-between pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HardHatIcon className="h-3.5 w-3.5" />
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
