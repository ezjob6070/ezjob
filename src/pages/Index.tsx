import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticsSection from "@/components/dashboard/StatisticsSection";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Construction, 
  HardHat, 
  Package, 
  Truck, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { format, isAfter, isBefore, isToday, addDays as addDaysDate, isWithinInterval } from "date-fns";

import {
  dashboardTaskCounts,
  dashboardFinancialMetrics,
  dashboardLeadSources,
  dashboardJobTypePerformance,
  dashboardTopTechnicians,
  dashboardActivities,
  dashboardEvents,
  detailedTasksData,
  detailedLeadsData,
  detailedRevenueData,
  detailedClientsData,
  detailedBusinessMetrics
} from "@/data/dashboardData";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeDialog, setActiveDialog] = useState<{
    open: boolean;
    type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics';
    title: string;
    data: any[];
  }>({
    open: false,
    type: 'tasks',
    title: '',
    data: []
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Fix: Map dashboard task counts to expected property names
  const taskCounts = {
    completed: dashboardTaskCounts.completed,
    inProgress: dashboardTaskCounts.inProgress,
    scheduled: dashboardTaskCounts.rescheduled, // Changed from scheduled to rescheduled
    cancelled: dashboardTaskCounts.canceled // Changed from cancelled to canceled
  };
  
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

  const openDetailDialog = (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => {
    setActiveDialog({
      open: true,
      type,
      title,
      data
    });
  };

  // Sample statistics data
  const revenueData = [
    { name: 'Jan', revenue: 4000, target: 2400 },
    { name: 'Feb', revenue: 3000, target: 2800 },
    { name: 'Mar', revenue: 2000, target: 3200 },
    { name: 'Apr', revenue: 2780, target: 3500 },
    { name: 'May', revenue: 1890, target: 3800 },
    { name: 'Jun', revenue: 2390, target: 4000 },
    { name: 'Jul', revenue: 3490, target: 4200 },
    { name: 'Aug', revenue: 4200, target: 4400 },
    { name: 'Sep', revenue: 4800, target: 4600 },
    { name: 'Oct', revenue: 5200, target: 4800 },
    { name: 'Nov', revenue: 5600, target: 5000 },
    { name: 'Dec', revenue: 6100, target: 5200 },
  ];

  const jobTypeData = [
    { name: 'Repair', value: 42 },
    { name: 'Installation', value: 28 },
    { name: 'Maintenance', value: 18 },
    { name: 'Other', value: 12 },
  ];

  // Sample analytics data
  const performanceData = [
    { month: 'Jan', calls: 24, jobs: 18, revenue: 4200 },
    { month: 'Feb', calls: 28, jobs: 22, revenue: 5100 },
    { month: 'Mar', calls: 32, jobs: 24, revenue: 5800 },
    { month: 'Apr', calls: 35, jobs: 28, revenue: 6200 },
    { month: 'May', calls: 30, jobs: 25, revenue: 5900 },
    { month: 'Jun', calls: 27, jobs: 23, revenue: 5400 },
    { month: 'Jul', calls: 29, jobs: 26, revenue: 6100 },
    { month: 'Aug', calls: 33, jobs: 28, revenue: 6500 },
    { month: 'Sep', calls: 37, jobs: 32, revenue: 7200 },
    { month: 'Oct', calls: 42, jobs: 34, revenue: 7800 },
    { month: 'Nov', calls: 45, jobs: 36, revenue: 8200 },
    { month: 'Dec', calls: 48, jobs: 40, revenue: 9100 },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Calculate project stats for the card
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
  const priorityProjects = projects.filter(p => {
    const endDate = new Date(p.endDate);
    const today = new Date();
    const nextWeek = addDaysDate(today, 7);
    return isAfter(endDate, today) && isBefore(endDate, nextWeek);
  }).length;
  
  const completionRate = Math.round(projects.reduce((sum, p) => sum + p.completion, 0) / totalProjects);
  
  // Get the 3 most recently updated projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.startDate).getTime() - new Date(a.updatedAt || a.startDate).getTime())
    .slice(0, 3);
  
  // Get the next upcoming deadlines
  const upcomingDeadlines = [...projects]
    .filter(p => p.status !== "Completed" && p.endDate)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 2);

  // Project Dashboard Section - New Addition
  const renderProjectSection = () => {
    // Calculate project stats
    const totalProjects = projects.length;
    const inProgressProjects = projects.filter(p => p.status === "In Progress").length;
    const completionRate = Math.round((projects.reduce((sum, p) => sum + p.completion, 0) / totalProjects));
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    
    // Get urgent projects (approaching deadline)
    const today = new Date();
    const nextWeek = addDaysDate(today, 7);
    
    const urgentProjects = projects.filter(project => {
      const endDate = new Date(project.endDate);
      return project.status === "In Progress" && 
             isAfter(endDate, today) && 
             isBefore(endDate, nextWeek);
    }).slice(0, 3);
    
    // Today's focus projects (today's deadlines or significant milestones)
    const todaysProjects = projects.filter(project => {
      const endDate = new Date(project.endDate);
      return isToday(endDate) || 
             (project.milestones && project.milestones.some(m => isToday(new Date(m.date))));
    }).slice(0, 3);
    
    // Mock data for construction-specific metrics
    const totalWorkersToday = 48;
    const vehiclesDeployed = 12;
    const materialsValue = 25600;
    
    return (
      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Projects Overview</h2>
          <Link to="/construction-projects">
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
                  <Construction className="h-3.5 w-3.5 text-purple-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-purple-800">{totalProjects}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-sm">
                  All time
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border border-blue-100 shadow-sm">
            <CardContent className="py-3 px-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-blue-700">In Progress</span>
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Construction className="h-3.5 w-3.5 text-blue-600" />
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
                  <Construction className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-800">{completionRate}%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                  Overall progress
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border border-amber-100 shadow-sm">
            <CardContent className="py-3 px-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-amber-700">Total Budget</span>
                <div className="p-1.5 bg-amber-100 rounded-full">
                  <Construction className="h-3.5 w-3.5 text-amber-600" />
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
                      <Construction className="h-4 w-4 text-purple-600" />
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
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
                  {urgentProjects.map((project) => (
                    <Link key={project.id} to={`/project/${project.id}`} className="block">
                      <div className="flex items-center justify-between p-2 rounded-lg border border-amber-100 hover:bg-amber-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{project.name}</h4>
                          <div className="flex items-center mt-1">
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-sm text-gray-500">No urgent deadlines</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // New Project Orders Card
  const renderProjectOrdersCard = () => {
    return (
      <Card className="bg-white shadow-sm mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <Construction className="h-5 w-5 mr-2 text-indigo-600" />
            Project Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Project Overview Stats */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Construction className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="ml-3 font-medium text-sm">Total Projects</span>
                  </div>
                  <span className="text-lg font-bold">{totalProjects}</span>
                </div>
                
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="ml-3 font-medium text-sm">In Progress</span>
                  </div>
                  <span className="text-lg font-bold">{inProgressProjects}</span>
                </div>
                
                <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="ml-3 font-medium text-sm">Priority</span>
                  </div>
                  <span className="text-lg font-bold">{priorityProjects}</span>
                </div>
                
                <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="ml-3 font-medium text-sm">Completion Rate</span>
                  </div>
                  <span className="text-lg font-bold">{completionRate}%</span>
                </div>
              </div>
            </div>
            
            {/* Recent Project Updates */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium">Recent Updates</h3>
              </div>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`} className="block">
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mr-3 flex-shrink-0">
                        <div className={`p-2 rounded-full 
                          ${project.status === 'Completed' ? 'bg-green-100' : 
                           project.status === 'In Progress' ? 'bg-blue-100' : 
                           'bg-amber-100'}`}>
                          <Construction className={`h-4 w-4 
                            ${project.status === 'Completed' ? 'text-green-600' : 
                             project.status === 'In Progress' ? 'text-blue-600' : 
                             'text-amber-600'}`} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-500">
                          {project.status} • {project.completion}% complete
                        </p>
                      </div>
                      <div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Upcoming Deadlines */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((project) => (
                  <Link key={project.id} to={`/project/${project.id}`} className="block">
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mr-3 flex-shrink-0">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Calendar className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                        <p className="text-xs text-gray-500">
                          Due {format(new Date(project.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <Badge variant="outline" className={`
                          ${isAfter(new Date(project.endDate), addDaysDate(new Date(), 3)) 
                            ? 'border-amber-200 bg-amber-50 text-amber-800' 
                            : 'border-red-200 bg-red-50 text-red-800'}`}>
                          {isAfter(new Date(project.endDate), addDaysDate(new Date(), 3)) 
                            ? format(new Date(project.endDate), 'd') + ' days' 
                            : 'Urgent'}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <Button asChild variant="ghost" className="w-full mt-2 text-xs h-8">
                  <Link to="/projects">View All Projects</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <StatisticsSection revenueData={revenueData} jobTypeData={jobTypeData} performanceData={performanceData} formatCurrency={formatCurrency} />;
      
      case 'analytics':
        return (
          <div className="space-y-4">
            <Card className="bg-white">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-64 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Revenue'];
                      }
                      return [value, name];
                    }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#4f46e5" name="Calls" />
                    <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#10b981" name="Jobs" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">84%</div>
                  <p className="text-indigo-100 text-xs">Calls to Jobs Conversion</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 4.2% from last month</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Avg. Job Value</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">{formatCurrency(235)}</div>
                  <p className="text-emerald-100 text-xs">Per completed job</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 2.8% from last month</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Technician Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-amber-100 text-xs">On-time completion rate</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 1.5% from last month</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default: // Dashboard tab
        return (
          <>
            <DashboardCalendar date={date} setDate={setDate} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Revenue</h3>
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dashboardFinancialMetrics.monthlyGrowth}%</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.totalRevenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">From {totalTasks} jobs</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Job Completion</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{Math.round((dashboardTaskCounts.completed / totalTasks) * 100)}%</span>
                  </div>
                  <div className="text-xl font-bold">{dashboardTaskCounts.completed}/{totalTasks}</div>
                  <div className="text-xs text-gray-500 mt-1">{dashboardTaskCounts.inProgress} in progress</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Average Value</h3>
                    <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Per Job</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.avgJobValue)}</div>
                  <div className="text-xs text-gray-500 mt-1">Conversion rate: {dashboardFinancialMetrics.conversionRate}%</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Project Section */}
            {renderProjectSection()}
            
            {/* New Project Orders Card */}
            {renderProjectOrdersCard()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TicketsStatusCard 
                taskCounts={taskCounts}
                totalTasks={totalTasks}
                openDetailDialog={openDetailDialog}
                detailedTasksData={detailedTasksData}
              />
              
              <PerformanceCard 
                leadSources={dashboardLeadSources.map(source => ({
                  name: source.name,
                  count: source.value,
                  percentage: source.percentage
                }))}
                jobTypePerformance={dashboardJobTypePerformance.map(item => ({
                  name: item.name,
                  count: item.value,
                  revenue: item.revenue,
                  avgValue: item.avgValue || 0
                }))}
                financialMetrics={dashboardFinancialMetrics}
                formatCurrency={formatCurrency}
                openDetailDialog={openDetailDialog}
                detailedBusinessMetrics={detailedBusinessMetrics}
              />
            </div>

            <TopTechniciansCard 
              topTechnicians={dashboardTopTechnicians}
              formatCurrency={formatCurrency}
              openDetailDialog={openDetailDialog}
              detailedClientsData={detailedClientsData}
            />
            
            <ActivitySection 
              activities={dashboardActivities}
              events={dashboardEvents}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-3 py-3">
      <DashboardHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {renderContent()}
      
      <DashboardDetailDialog
        open={activeDialog.open}
        onOpenChange={(open) => setActiveDialog({...activeDialog, open})}
        title={activeDialog.title}
        type={activeDialog.type}
        data={activeDialog.data}
      />
    </div>
  );
};

export default Index;
