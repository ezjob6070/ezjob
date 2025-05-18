
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { BadgeDollarSign, ChartBar, Building, PhoneCall, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedDonutChart } from "@/components/EnhancedDonutChart";
import { Badge } from "@/components/ui/badge";
import JobStatusDialog from "@/components/JobStatusDialog";
import ProjectsDashboardSection from "@/components/dashboard/ProjectsDashboardSection";
import SearchBar from "@/components/finance/filters/SearchBar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Link } from "react-router-dom";

import {
  dashboardTaskCounts,
  dashboardFinancialMetrics,
  jobsByStatus
} from "@/data/dashboardData";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
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

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    status: string;
    title: string;
    data: any[];
  }>({
    open: false,
    status: '',
    title: '',
    data: []
  });

  const { jobs } = useGlobalState();

  // Use our predefined fake data
  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);
  const totalRevenue = dashboardFinancialMetrics.totalRevenue;
  const totalExpenses = totalRevenue * 0.4;
  const companyProfit = totalRevenue - totalExpenses;

  // Sample data for call tracking section
  const callsData = {
    total: 154,
    converted: 98,
    scheduled: 37,
    missed: 19,
    conversionRate: 63
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // In a real app, this would filter data based on search term
    if (value.length > 0) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${value}`,
        duration: 3000
      });
    }
  };

  const openStatusDialog = (status: string, title: string, data: any[]) => {
    setStatusDialog({
      open: true,
      status,
      title,
      data
    });
  };

  // Create job status data for the circular visualization with enhanced colors and gradients
  const jobStatusData = [
    { name: 'Completed', value: dashboardTaskCounts.completed, color: '#22c55e', gradientFrom: '#4ade80', gradientTo: '#16a34a' },
    { name: 'In Progress', value: dashboardTaskCounts.inProgress, color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb' },
    { name: 'Cancelled', value: dashboardTaskCounts.canceled, color: '#ef4444', gradientFrom: '#f87171', gradientTo: '#dc2626' },
    { name: 'Rescheduled', value: dashboardTaskCounts.rescheduled, color: '#ec4899', gradientFrom: '#f472b6', gradientTo: '#db2777' },
  ];

  // Today's appointments data
  const todaysJobs = [
    { clientName: "Sarah Johnson", time: "09:30 AM", jobType: "Installation", address: "123 Main St", priority: "high" },
    { clientName: "James Wilson", time: "11:00 AM", jobType: "Repair", address: "456 Oak Ave", priority: "medium" },
    { clientName: "Emily Davis", time: "01:15 PM", jobType: "Maintenance", address: "789 Pine Rd", priority: "low" },
    { clientName: "Michael Brown", time: "03:30 PM", jobType: "Inspection", address: "234 Elm St", priority: "medium" },
  ];

  return (
    <div className="space-y-3 py-3">
      <DashboardHeader 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
      />
      
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          showIcons={true}
          placeholder="Search jobs, clients, technicians..."
          className="bg-white shadow-sm border border-gray-100 rounded-lg"
        />
      </div>
      
      {/* Top Section - Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {/* Revenue Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <BadgeDollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                78% of goal
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Net Profit Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <ChartBar className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(companyProfit)}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
                {Math.round((companyProfit / totalRevenue) * 100)}% margin
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Calls Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-full">
                    <PhoneCall className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Total Calls</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">{callsData.total}</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                {callsData.conversionRate}% conversion
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Conversion Rate Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-full">
                    <Building className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">Projects</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-900">24</p>
              </div>
              
              <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
                8 active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Middle Section - Jobs Overview (50% height) */}
      <Card className="bg-white border-0 shadow-sm mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">Today's Jobs</CardTitle>
              <CardDescription>Scheduled service calls for today</CardDescription>
            </div>
            <Link to="/jobs">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 h-8 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              >
                View All Jobs <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {todaysJobs.map((job, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      className={`
                        ${job.priority === "high" ? "bg-red-100 text-red-800" : 
                          job.priority === "medium" ? "bg-amber-100 text-amber-800" : 
                          "bg-green-100 text-green-800"}
                      `}
                    >
                      {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                    </Badge>
                    <span className="text-sm text-gray-500">{job.time}</span>
                  </div>
                  <h3 className="font-medium text-base mb-1">{job.clientName}</h3>
                  <div className="text-sm text-gray-600 mb-2">{job.jobType}</div>
                  <div className="text-xs text-gray-500">{job.address}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Job Status Visualization */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-4 md:mb-0 flex justify-center">
                <EnhancedDonutChart 
                  data={jobStatusData}
                  title={`${totalTasks}`}
                  subtitle="Total Jobs"
                  size={200} 
                  thickness={40}
                  gradients={true}
                  animation={true}
                  showLegend={false}
                />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {jobStatusData.map((status, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col p-2 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openStatusDialog(status.name.toLowerCase(), `${status.name} Jobs`, 
                        status.name === 'Completed' ? jobsByStatus.completed :
                        status.name === 'In Progress' ? jobsByStatus.inProgress :
                        status.name === 'Cancelled' ? jobsByStatus.canceled :
                        jobsByStatus.rescheduled
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2 shadow-sm" 
                            style={{ 
                              background: `linear-gradient(135deg, ${status.gradientFrom}, ${status.gradientTo})` 
                            }}
                          ></div>
                          <span className="font-medium text-sm text-gray-700">{status.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{status.value}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${(status.value / totalTasks) * 100}%`,
                            background: `linear-gradient(90deg, ${status.gradientFrom}, ${status.gradientTo})`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom Section - Projects Overview (50% height) */}
      <ProjectsDashboardSection />
      
      {/* Dialogs */}
      <JobStatusDialog 
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({...statusDialog, open})}
        status={statusDialog.status}
        title={statusDialog.title}
        data={statusDialog.data}
      />
      
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

export default Dashboard;
