
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, File, TrendingUp, Building, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { projects } from "@/data/projects";
import { SortOption } from "@/types/sortOptions";

const ProjectsDashboardSection = () => {
  // Calculate project stats
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
  const completionRate = totalProjects ? Math.round((projects.reduce((sum, p) => sum + p.completion, 0) / totalProjects)) : 0;
  
  // Get the 3 most recent projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  // Calculate high-priority projects (those with less than 50% completion but more than halfway to deadline)
  const now = new Date();
  const highPriorityProjects = projects.filter(project => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.expectedEndDate);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const timeProgress = (elapsed / totalDuration) * 100;
    
    return project.status === "In Progress" && project.completion < 50 && timeProgress > 50;
  });

  return (
    <div className="space-y-4">
      {/* Project Quick Look section - NOW FIRST for better visibility */}
      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Project Quick Look</CardTitle>
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Details
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projects behind schedule */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-medium">High Priority Projects</h3>
              </div>
              
              {highPriorityProjects.length > 0 ? (
                <div className="space-y-2">
                  {highPriorityProjects.slice(0, 2).map(project => (
                    <Link key={project.id} to={`/projects/${project.id}`} className="block">
                      <div className="p-2 bg-amber-50 rounded-md border border-amber-100">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-sm">{project.name}</h4>
                          <span className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-0.5">
                            {project.completion}% Complete
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-amber-700">
                          <span>{project.type}</span>
                          <span>Due: {new Date(project.expectedEndDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No high priority projects at the moment</p>
              )}
            </div>
            
            {/* Budget overview */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h3 className="text-sm font-medium">Budget Overview</h3>
              </div>
              
              <div className="space-y-3">
                {/* Total allocated budget */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Budget</span>
                  <span className="font-medium">{formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}</span>
                </div>
                
                {/* Spent so far */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Spent</span>
                  <span className="font-medium">{formatCurrency(projects.reduce((sum, p) => sum + p.actualSpent, 0))}</span>
                </div>
                
                {/* Remaining budget */}
                <div className="flex justify-between items-center font-medium">
                  <span className="text-xs">Remaining</span>
                  <span className="text-green-600">{formatCurrency(
                    projects.reduce((sum, p) => sum + p.budget, 0) - projects.reduce((sum, p) => sum + p.actualSpent, 0)
                  )}</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Budget Utilization</span>
                    <span>
                      {Math.round((projects.reduce((sum, p) => sum + p.actualSpent, 0) / projects.reduce((sum, p) => sum + p.budget, 0)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(projects.reduce((sum, p) => sum + p.actualSpent, 0) / projects.reduce((sum, p) => sum + p.budget, 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Projects Overview</CardTitle>
            <Link to="/projects">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                View All Projects
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-purple-700">Total Projects</span>
                <div className="p-1.5 bg-purple-100 rounded-full">
                  <Building className="h-3.5 w-3.5 text-purple-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-purple-800">{totalProjects}</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-blue-700">In Progress</span>
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-blue-800">{inProgressProjects}</div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-emerald-700">Avg. Completion</span>
                <div className="p-1.5 bg-emerald-100 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-800">{completionRate}%</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Recent Projects</h3>
            {recentProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="block">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{project.name}</h4>
                      <Badge
                        className={`text-xs ${
                          project.status === "In Progress" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" :
                          project.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                          project.status === "On Hold" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                          "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{project.type}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">${(project.budget / 1000).toFixed(0)}K budget</span>
                        <span className="text-xs text-gray-500">{project.completion}% complete</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsDashboardSection;
