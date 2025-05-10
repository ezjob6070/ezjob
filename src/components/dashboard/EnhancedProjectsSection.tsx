
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  File, 
  Hammer, 
  HardHat, 
  Package, 
  TrendingUp, 
  Truck, 
  Users, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { projects } from "@/data/projects";
import { format, isAfter, isBefore, isToday, addDays, isWithinInterval } from 'date-fns';

interface EnhancedProjectsSectionProps {
  dateFilter?: DateRange;
}

const EnhancedProjectsSection = ({ dateFilter }: EnhancedProjectsSectionProps) => {
  // Calculate project stats
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
  const completionRate = totalProjects ? Math.round((projects.reduce((sum, p) => sum + p.completion, 0) / totalProjects)) : 0;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  
  // Get projects that are urgent (approaching deadline)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const urgentProjects = projects.filter(project => {
    const endDate = new Date(project.endDate);
    return project.status === "In Progress" && 
           isAfter(endDate, today) && 
           isBefore(endDate, nextWeek);
  });
  
  // Get today's focus projects (today's deadlines or significant milestones)
  const todaysProjects = projects.filter(project => {
    const endDate = new Date(project.endDate);
    return isToday(endDate) || 
           (project.milestones && project.milestones.some(m => isToday(new Date(m.date))));
  });
  
  // Filter projects based on date range if provided
  const getFilteredProjects = () => {
    if (!dateFilter?.from) return projects;
    
    return projects.filter(project => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      
      // Check if project overlaps with the date range
      return dateFilter.to
        ? (isWithinInterval(startDate, { start: dateFilter.from, end: dateFilter.to }) || 
           isWithinInterval(endDate, { start: dateFilter.from, end: dateFilter.to }))
        : isAfter(startDate, dateFilter.from);
    });
  };
  
  const filteredProjects = getFilteredProjects();
  
  // Mock data for construction-specific metrics
  const totalWorkersToday = 48;
  const vehiclesDeployed = 12;
  const materialsValue = 25600;
  
  // Calculate projects at risk (behind schedule)
  const atRiskProjects = projects.filter(p => {
    return p.status === "In Progress" && p.completion < 40 && 
           isAfter(today, addDays(new Date(p.startDate), 14)); // 2 weeks after start
  });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Projects Overview</h2>
        <Link to="/projects">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            View All Projects
          </Button>
        </Link>
      </div>
      
      {/* Project metrics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-purple-50 border border-purple-100 shadow-sm">
          <CardContent className="py-3 px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-purple-700">Total Projects</span>
              <div className="p-1.5 bg-purple-100 rounded-full">
                <File className="h-3.5 w-3.5 text-purple-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-purple-800">{totalProjects}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-sm">
                {filteredProjects.length !== totalProjects ? 
                  `${filteredProjects.length} in selected period` : 
                  'All time'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border border-blue-100 shadow-sm">
          <CardContent className="py-3 px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-blue-700">In Progress</span>
              <div className="p-1.5 bg-blue-100 rounded-full">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-blue-800">{inProgressProjects}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-sm">
                {urgentProjects.length} need attention
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border border-emerald-100 shadow-sm">
          <CardContent className="py-3 px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-emerald-700">Avg. Completion</span>
              <div className="p-1.5 bg-emerald-100 rounded-full">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-800">{completionRate}%</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                {atRiskProjects.length} at risk
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border border-amber-100 shadow-sm">
          <CardContent className="py-3 px-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-amber-700">Total Budget</span>
              <div className="p-1.5 bg-amber-100 rounded-full">
                <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-800">{formatCurrency(totalBudget)}</div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-sm">
                Avg: {formatCurrency(totalBudget / totalProjects)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Construction-specific metrics and Today's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Construction Activity - Left Column */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Today's Construction Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="p-1.5 bg-blue-100 rounded-full mr-3">
                    <HardHat className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Workers on Site</span>
                </div>
                <span className="text-sm font-medium">{totalWorkersToday}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="p-1.5 bg-amber-100 rounded-full mr-3">
                    <Truck className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm">Vehicles Deployed</span>
                </div>
                <span className="text-sm font-medium">{vehiclesDeployed}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="p-1.5 bg-emerald-100 rounded-full mr-3">
                    <Package className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-sm">Materials Value</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(materialsValue)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="p-1.5 bg-purple-100 rounded-full mr-3">
                    <Hammer className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm">Active Sites</span>
                </div>
                <span className="text-sm font-medium">{inProgressProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Focus Projects - Middle Column */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todaysProjects.length > 0 ? (
              <div className="space-y-3">
                {todaysProjects.slice(0, 3).map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`} className="block">
                    <div className="flex items-center justify-between p-2 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-blue-500 mr-1" />
                          <span className="text-xs text-gray-500">Due today</span>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-800 text-xs hover:bg-blue-200">
                          {project.completion}%
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {todaysProjects.length === 0 && (
                  <div className="flex items-center justify-center py-6 text-gray-400">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>No projects due today</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Clock className="h-8 w-8 text-gray-300 mb-2" />
                <span className="text-sm text-gray-500">No focus projects for today</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Urgent Projects - Right Column */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Approaching Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {urgentProjects.length > 0 ? (
              <div className="space-y-3">
                {urgentProjects.slice(0, 3).map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`} className="block">
                    <div className="flex items-center justify-between p-2 rounded-lg border border-amber-100 hover:bg-amber-50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        <div className="flex items-center mt-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                          <span className="text-xs text-gray-500">
                            Due {format(new Date(project.endDate), 'MMM d')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Badge className={`${
                          project.completion < 50 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        } text-xs hover:bg-amber-200`}>
                          {project.completion}%
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {urgentProjects.length > 3 && (
                  <div className="text-center mt-2">
                    <Link to="/projects">
                      <Button variant="link" size="sm" className="text-xs text-blue-600">
                        View {urgentProjects.length - 3} more urgent projects
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-8 w-8 text-emerald-300 mb-2" />
                <span className="text-sm text-gray-500">No urgent deadlines</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Projects List */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredProjects
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .slice(0, 3)
              .map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block">
                  <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm line-clamp-1">{project.name}</h3>
                      <Badge
                        className={`text-[0.65rem] ${
                          project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          project.status === "Completed" ? "bg-green-100 text-green-800" :
                          "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{project.team?.length || 3} team members</span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 flex justify-between mb-1">
                        <span>Progress</span>
                        <span>{project.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`${
                            project.completion < 30 ? "bg-red-500" :
                            project.completion < 70 ? "bg-amber-500" :
                            "bg-green-500"
                          } h-1.5 rounded-full`}
                          style={{ width: `${project.completion}%` }}
                        />
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

export default EnhancedProjectsSection;
