
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import EmployeesList from "@/components/employed/EmployeesList";
import ResumesList from "@/components/employed/ResumesList";
import AddEmployeeModal from "@/components/employed/AddEmployeeModal";
import EditEmployeeModal from "@/components/employed/EditEmployeeModal";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showUploadResumeModal, setShowUploadResumeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Stats calculation
  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const pendingEmployees = employees.filter(emp => emp.status === "pending").length;
  const inactiveEmployees = employees.filter(emp => emp.status === "inactive").length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    toast({
      title: "Success",
      description: "Employee has been added successfully",
    });
  };
  
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditEmployeeModal(true);
  };
  
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prevEmployees) => 
      prevEmployees.map((emp) => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    toast({
      title: "Success",
      description: "Employee updated successfully",
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
  
  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
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
          {/* Employee Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {new Set(employees.map(e => e.department)).size} departments
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((activeEmployees / employees.length) * 100)}% of total workforce
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inactiveEmployees + pendingEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingEmployees} pending, {inactiveEmployees} inactive
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSalary.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${Math.round(totalSalary / Math.max(activeEmployees, 1)).toLocaleString()} avg. per active employee
                </p>
              </CardContent>
            </Card>
          </div>

          <EmployeesList 
            employees={employees} 
            onEditEmployee={handleEditEmployee}
            selectedEmployees={selectedEmployees}
            onToggleSelect={toggleEmployee}
          />
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
      
      <EditEmployeeModal
        open={showEditEmployeeModal}
        onOpenChange={setShowEditEmployeeModal}
        onUpdateEmployee={handleUpdateEmployee}
        employee={selectedEmployee}
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
