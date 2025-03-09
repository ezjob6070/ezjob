
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import EmployeesList from "@/components/employed/EmployeesList";
import ResumesList from "@/components/employed/ResumesList";
import AddEmployeeModal from "@/components/employed/AddEmployeeModal";
import UploadResumeModal from "@/components/employed/UploadResumeModal";
import ReportsSection from "@/components/employed/ReportsSection";

import { initialEmployees, initialResumes, employeeReports } from "@/data/employees";
import { Employee, Resume, Report, ResumeStatus } from "@/types/employee";

const Employed = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [reports, setReports] = useState<Report[]>(employeeReports);
  
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showUploadResumeModal, setShowUploadResumeModal] = useState(false);
  
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    toast({
      title: "Success",
      description: "Employee has been added successfully",
    });
  };
  
  const handleUploadResume = (newResume: Resume) => {
    setResumes((prev) => [newResume, ...prev]);
    toast({
      title: "Success",
      description: "Resume has been uploaded successfully",
    });
  };
  
  const handleResumeStatusChange = (id: string, status: "approved" | "rejected") => {
    setResumes((prev) => 
      prev.map((resume) => 
        resume.id === id 
          ? { ...resume, status: status === "approved" ? ResumeStatus.APPROVED : ResumeStatus.REJECTED } 
          : resume
      )
    );
    
    toast({
      title: status === "approved" ? "Resume Approved" : "Resume Rejected",
      description: `The resume has been ${status === "approved" ? "approved" : "rejected"} successfully`,
    });
  };
  
  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Employment Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage employees, review resumes, and track reports
          </p>
        </div>
        
        <div className="flex gap-3">
          {activeTab === "employees" && (
            <Button 
              onClick={() => setShowAddEmployeeModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          )}
          
          {activeTab === "resumes" && (
            <Button 
              onClick={() => setShowUploadResumeModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Resume
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        defaultValue="employees" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="mt-6">
          <EmployeesList employees={employees} />
        </TabsContent>
        
        <TabsContent value="resumes" className="mt-6">
          <ResumesList 
            resumes={resumes} 
            onStatusChange={handleResumeStatusChange} 
          />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <ReportsSection 
            reports={reports}
            employees={employees}
          />
        </TabsContent>
      </Tabs>
      
      <AddEmployeeModal
        open={showAddEmployeeModal}
        onOpenChange={setShowAddEmployeeModal}
        onAddEmployee={handleAddEmployee}
      />
      
      <UploadResumeModal
        open={showUploadResumeModal}
        onOpenChange={setShowUploadResumeModal}
        onUploadResume={handleUploadResume}
      />
    </div>
  );
};

export default Employed;
