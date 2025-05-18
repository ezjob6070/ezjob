import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, FileText, Image, MapPin, Users, Truck, DollarSign, ListTodo, Edit, User, Package, Clock } from "lucide-react";
import { initialProjects } from "@/data/projects";
import { Project, ProjectContractor } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import ProjectFinanceTab from "@/components/project/ProjectFinanceTab";
import ProjectTasksTab from "@/components/project/ProjectTasksTab";
import ProjectStaffTab from "@/components/project/ProjectStaffTab";
import ProjectEquipmentTab from "@/components/project/ProjectEquipmentTab";
import ProjectTimeScheduleTab from "@/components/project/ProjectTimeScheduleTab";
import ProjectScheduleAndTasksTab from "@/components/project/ProjectScheduleAndTasksTab";
import TasksAndProgress from "@/components/project/TasksAndProgress";

interface ProjectFile {
  id: string;
  name: string;
  type: "document" | "image";
  date: Date;
  url: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: "file-1",
      name: "Project Blueprint.pdf",
      type: "document",
      date: new Date(2024, 3, 15),
      url: "#"
    },
    {
      id: "file-2",
      name: "Site Photo 1.jpg",
      type: "image",
      date: new Date(2024, 3, 20),
      url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=870&auto=format&fit=crop"
    },
    {
      id: "file-3",
      name: "Contract.pdf",
      type: "document",
      date: new Date(2024, 3, 10),
      url: "#"
    }
  ]);

  // Find project by ID
  const project = initialProjects.find(p => p.id === Number(id)) || {
    id: 0,
    name: "Project Not Found",
    type: "Unknown",
    description: "Project details not available",
    location: "Unknown",
    completion: 0,
    workers: 0,
    vehicles: 0,
    status: "Not Started" as const,
    startDate: "",
    expectedEndDate: "",
    budget: 0,
    actualSpent: 0,
    clientName: "Unknown",
    revenue: 0,
    contractors: []
  };
  
  const [currentProject, setCurrentProject] = useState<Project>(project);

  const handleFileUpload = (type: "document" | "image") => {
    // This would be replaced with actual file upload logic
    const newFile: ProjectFile = {
      id: `file-${files.length + 1}`,
      name: type === "document" ? "New Document.pdf" : "New Image.jpg",
      type: type,
      date: new Date(),
      url: type === "image" ? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" : "#"
    };

    setFiles(prev => [...prev, newFile]);
    toast.success(`${type === "document" ? "Document" : "Image"} uploaded successfully`);
  };

  const handleEditProject = () => {
    // This would be replaced with actual edit logic
    toast.success("Project details updated successfully");
    setShowEditDialog(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setCurrentProject(updatedProject);
    // In a real app, this would update the backend
    toast.success("Project updated successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Button>
        
        <Badge 
          className={`
            ${currentProject.status === "In Progress" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : 
              currentProject.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
              "bg-amber-100 text-amber-800 hover:bg-amber-200"}
          `}
        >
          {currentProject.status}
        </Badge>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">{currentProject.name}</h1>
        <p className="text-muted-foreground">{currentProject.type}</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" variant="blue">Overview</TabsTrigger>
          <TabsTrigger value="tasks-and-progress" variant="blue">
            <span className="flex items-center gap-1">
              <ListTodo className="h-4 w-4" />
              Tasks & Progress
            </span>
          </TabsTrigger>
          <TabsTrigger value="schedule-tasks" variant="blue">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Schedule
            </span>
          </TabsTrigger>
          <TabsTrigger value="staff" variant="blue">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Staff & Contractors
            </span>
          </TabsTrigger>
          <TabsTrigger value="equipment" variant="blue">
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              Equipment & Materials
            </span>
          </TabsTrigger>
          <TabsTrigger value="files" variant="blue">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Files & Documents
            </span>
          </TabsTrigger>
          <TabsTrigger value="finance" variant="blue">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Finance
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Info Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Details</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{currentProject.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {currentProject.location}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Client</h3>
                    <p className="text-gray-600">{currentProject.clientName}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {currentProject.startDate}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Expected Completion</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {currentProject.expectedEndDate}
                    </div>
                  </div>
                </div>

                {/* Contractors Section */}
                {currentProject.contractors && currentProject.contractors.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-3">Contractors</h3>
                      <div className="space-y-3">
                        {currentProject.contractors.map((contractor: ProjectContractor) => (
                          <div key={contractor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <User size={16} />
                              </div>
                              <div>
                                <p className="font-medium">{contractor.name}</p>
                                <p className="text-sm text-gray-600">{contractor.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatCurrency(contractor.totalPaid)}</p>
                              <p className="text-xs text-muted-foreground">${contractor.rate}/{contractor.rateType}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Financial Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Budget</div>
                  <div className="text-2xl font-bold">{formatCurrency(currentProject.budget)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Spent So Far</div>
                  <div className="text-2xl font-bold">{formatCurrency(currentProject.actualSpent)}</div>
                  <div className="text-sm text-muted-foreground">
                    ({Math.round((currentProject.actualSpent / currentProject.budget) * 100)}% of budget)
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Project Progress</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-full rounded-full bg-blue-500" 
                        style={{ width: `${currentProject.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{currentProject.completion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Resources Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={18} />
                  Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentProject.workers}</div>
                <p className="text-sm text-muted-foreground">Currently assigned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck size={18} />
                  Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentProject.vehicles}</div>
                <p className="text-sm text-muted-foreground">Currently assigned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Schedule Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-800 border-green-200">On Schedule</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks-and-progress" className="py-4">
          <TasksAndProgress project={currentProject} onUpdateProject={handleUpdateProject} />
        </TabsContent>
        
        <TabsContent value="schedule-tasks" className="py-4">
          <ProjectScheduleAndTasksTab project={currentProject} projectStaff={currentProject.staff} />
        </TabsContent>
        
        <TabsContent value="staff" className="py-4">
          <ProjectStaffTab projectId={currentProject.id} projectStaff={currentProject.staff} />
        </TabsContent>
        
        <TabsContent value="equipment" className="py-4">
          <ProjectEquipmentTab 
            projectId={currentProject.id} 
            projectEquipment={currentProject.equipment} 
            projectMaterials={currentProject.materials} 
          />
        </TabsContent>
        
        <TabsContent value="files" className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Project Files</h2>
            <div className="flex gap-2">
              <Button onClick={() => handleFileUpload("document")} className="flex items-center gap-2">
                <FileText size={16} />
                Upload Document
              </Button>
              <Button onClick={() => handleFileUpload("image")} className="flex items-center gap-2">
                <Image size={16} />
                Upload Image
              </Button>
            </div>
          </div>
          
          {/* Files Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map(file => (
              <Card key={file.id} className="overflow-hidden">
                {file.type === "image" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={file.url} 
                            alt={file.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Added on {file.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{file.name}</DialogTitle>
                        <DialogDescription>
                          Added on {file.date.toLocaleDateString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img 
                          src={file.url} 
                          alt={file.name} 
                          className="max-h-[70vh] object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="p-4 flex items-start gap-3">
                    <div className="bg-blue-100 p-3 rounded-md">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Added on {file.date.toLocaleDateString()}
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-1">
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {files.length === 0 && (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No files uploaded yet</h3>
              <p className="text-gray-500 mb-4">
                Upload documents or images related to this project
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="finance" className="py-4">
          <ProjectFinanceTab project={currentProject} />
        </TabsContent>
      </Tabs>
      
      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details and information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <input
                id="project-name"
                defaultValue={currentProject.name}
                className="border rounded-md p-2"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="project-description"
                defaultValue={currentProject.description}
                rows={3}
                className="border rounded-md p-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="project-location" className="text-sm font-medium">
                  Location
                </label>
                <input
                  id="project-location"
                  defaultValue={currentProject.location}
                  className="border rounded-md p-2"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="project-client" className="text-sm font-medium">
                  Client
                </label>
                <input
                  id="project-client"
                  defaultValue={currentProject.clientName}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="project-start" className="text-sm font-medium">
                  Start Date
                </label>
                <input
                  id="project-start"
                  type="date"
                  defaultValue={currentProject.startDate}
                  className="border rounded-md p-2"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="project-end" className="text-sm font-medium">
                  Expected End Date
                </label>
                <input
                  id="project-end"
                  type="date"
                  defaultValue={currentProject.expectedEndDate}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="project-budget" className="text-sm font-medium">
                  Budget
                </label>
                <input
                  id="project-budget"
                  type="number"
                  defaultValue={currentProject.budget}
                  className="border rounded-md p-2"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="project-status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="project-status"
                  defaultValue={currentProject.status}
                  className="border rounded-md p-2"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
