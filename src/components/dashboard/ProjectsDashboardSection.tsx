
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, Clock, FolderIcon, TrendingUp } from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const ProjectsDashboardSection = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const navigate = useNavigate();
  const { dateFilter } = useGlobalState();
  
  // Function to filter projects based on date if needed
  const filterProjectsByDate = () => {
    if (!dateFilter?.from) return initialProjects;
    
    return initialProjects.filter(project => {
      // Simulating a date for projects - in a real app, you'd have actual dates to filter by
      // For demo purposes, we'll just filter randomly to show the functionality
      const randomDateMatch = Math.random() > 0.5;
      return randomDateMatch;
    });
  };
  
  // Update projects when date filter changes
  useEffect(() => {
    setProjects(filterProjectsByDate());
  }, [dateFilter]);
  
  const inProgressProjects = projects.filter(project => project.status === "In Progress");
  const totalProjects = projects.length;
  
  // Calculate average completion for in progress projects
  const avgCompletion = inProgressProjects.length > 0
    ? Math.round(inProgressProjects.reduce((acc, p) => acc + p.completion, 0) / inProgressProjects.length)
    : 0;
    
  const dateFilterLabel = dateFilter?.from 
    ? (dateFilter.to 
      ? `${dateFilter.from.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - ${dateFilter.to.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}`
      : dateFilter.from.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }))
    : "All time";
  
  const goToProjects = () => {
    navigate('/projects');
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium">Projects Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        {/* Total Projects */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={goToProjects}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-purple-700">Total Projects</span>
            <div className="p-1.5 bg-purple-100 rounded-full">
              <BriefcaseIcon className="h-3.5 w-3.5 text-purple-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-800">{totalProjects}</div>
          <div className="text-xs text-purple-600 mt-1">{dateFilterLabel}</div>
        </div>
        
        {/* In Progress */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/projects/in-progress')}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-blue-700">In Progress</span>
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-800">{inProgressProjects.length}</div>
          <div className="text-xs text-blue-600 mt-1">{dateFilterLabel}</div>
        </div>
        
        {/* Avg. Completion */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-emerald-700">Avg. Completion</span>
            <div className="p-1.5 bg-emerald-100 rounded-full">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-800">
            {avgCompletion}%
          </div>
          <div className="text-xs text-emerald-600 mt-1">In progress projects</div>
        </div>
      </div>
      
      {/* Display some featured projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {projects.slice(0, 3).map(project => (
          <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={goToProjects}>
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm truncate pr-2">{project.name}</h3>
                <Badge className={`text-xs ${
                  project.status === "In Progress" 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}>
                  {project.status}
                </Badge>
              </div>
              {project.status === "In Progress" && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 mb-1">
                  <div 
                    className="h-full rounded-full bg-blue-500" 
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              )}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{project.clientName}</span>
                <span className="font-medium">{formatCurrency(project.budget)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectsDashboardSection;
