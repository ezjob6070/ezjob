
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChartIcon, ListIcon, PlusIcon, FilterIcon } from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";
import ProjectFilters from "@/components/projects/ProjectFilters";
import { DateRange } from "react-day-picker";

export default function ProjectsAll() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<'cards' | 'list'>('list');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedSalesmen, setSelectedSalesmen] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const handleCreateProject = () => {
    toast.info("Create project functionality will be implemented soon");
  };
  
  // Extract unique contractor names from projects
  const contractorNames = Array.from(
    new Set(
      projects.flatMap(project => 
        project.contractors?.map(contractor => contractor.name) || []
      )
    )
  );
  
  // For this example, we'll assume salesmen could be stored in a similar field
  // In a real app, you might have a dedicated field for sales representatives
  const salesmenNames = Array.from(
    new Set(
      projects.flatMap(project => 
        project.salesmen?.map(salesman => salesman.name) || []
      ).filter(Boolean)
    )
  );
  
  // Apply filters when they change
  const applyFilters = () => {
    let filtered = [...projects];
    
    // Filter by contractors
    if (selectedContractors.length > 0) {
      filtered = filtered.filter(project => 
        project.contractors?.some(contractor => 
          selectedContractors.includes(contractor.name)
        )
      );
    }
    
    // Filter by salesmen
    if (selectedSalesmen.length > 0) {
      filtered = filtered.filter(project => 
        project.salesmen?.some(salesman => 
          selectedSalesmen.includes(salesman.name)
        )
      );
    }
    
    // Filter by date range
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      const toDate = dateRange.to ? new Date(dateRange.to) : new Date();
      
      filtered = filtered.filter(project => {
        const projectStartDate = new Date(project.startDate);
        return projectStartDate >= fromDate && projectStartDate <= toDate;
      });
    }
    
    setFilteredProjects(filtered);
  };
  
  // Handle filter changes
  const handleFilterChange = () => {
    applyFilters();
    setIsFilterOpen(false);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSelectedContractors([]);
    setSelectedSalesmen([]);
    setDateRange(undefined);
    setFilteredProjects(projects);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
          <p className="text-muted-foreground">Complete list of all projects in the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-1"
          >
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
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
      
      {isFilterOpen && (
        <ProjectFilters 
          contractorNames={contractorNames}
          selectedContractors={selectedContractors}
          setSelectedContractors={setSelectedContractors}
          salesmenNames={salesmenNames}
          selectedSalesmen={selectedSalesmen}
          setSelectedSalesmen={setSelectedSalesmen}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApply={handleFilterChange}
          onReset={handleResetFilters}
        />
      )}
      
      {view === 'list' ? (
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
                    <tr key={project.id} className="border-b hover:bg-gray-50">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-medium">{project.name}</h3>
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
                <p className="text-sm text-gray-500 mb-3">{project.type}</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-full rounded-full bg-blue-500" 
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{project.completion}% complete</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Client: {project.clientName}</span>
                    <span className="font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
