
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { initialProjects } from "@/data/projects";
import ProjectTasks from "@/components/project/ProjectTasks";

export default function ProjectTasksPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find project by ID
  const project = initialProjects.find(p => p.id === Number(id));

  const handleGoBack = () => {
    navigate(`/project/${id}`);
  };

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Button onClick={() => navigate('/projects')}>Return to Projects</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.name} - Tasks</h1>
          <p className="text-muted-foreground">Manage tasks and track progress</p>
        </div>
      </div>

      <ProjectTasks projectId={project.id} projectName={project.name} />
    </div>
  );
}
