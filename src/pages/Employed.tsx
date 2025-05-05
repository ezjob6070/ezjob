
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialEmployees } from "@/data/employees";
import { initialResumes } from "@/data/employees";
import { Employee, EMPLOYEE_STATUS, RESUME_STATUS, Resume } from "@/types/employee";
import EmployeesList from "@/components/employed/EmployeesList";
import ResumesList from "@/components/employed/ResumesList";
import AddEmployeeModal from "@/components/employed/AddEmployeeModal";
import EditEmployeeModal from "@/components/employed/EditEmployeeModal";
import UploadResumeModal from "@/components/employed/UploadResumeModal";
import EmployeeSearchBar from "@/components/employed/EmployeeSearchBar";
import EmployeeFilters from "@/components/employed/EmployeeFilters";
import ReportsSection from "@/components/employed/ReportsSection";
import { employeeReports } from "@/data/employees";
import { useToast } from "@/hooks/use-toast";

const Employed = () => {
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [uploadResumeOpen, setUploadResumeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState(initialEmployees);
  const [resumes, setResumes] = useState(initialResumes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatus.length === 0 || 
        selectedStatus.includes(employee.status.toString());

      // Department filter
      const matchesDepartment = selectedDepartment.length === 0 || 
        selectedDepartment.includes(employee.department);

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchQuery, selectedStatus, selectedDepartment]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (statuses: string[]) => {
    setSelectedStatus(statuses);
  };

  const handleDepartmentFilter = (departments: string[]) => {
    setSelectedDepartment(departments);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setSelectedEmployee(null);
  };

  const handleAddEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added successfully.`
    });
  };

  const handleUploadResume = (resume: Resume) => {
    setResumes(prev => [...prev, resume]);
    toast({
      title: "Resume Uploaded",
      description: `Resume for ${resume.name} has been uploaded successfully.`
    });
  };

  const handleResumeStatusChange = (resume: Resume, newStatus: RESUME_STATUS) => {
    setResumes(prevResumes => 
      prevResumes.map(res => 
        res.id === resume.id ? { ...res, status: newStatus } : res
      )
    );
    toast({
      title: "Resume Status Updated",
      description: `${resume.name}'s resume status changed to ${newStatus}.`
    });
  };

  const availableDepartments = useMemo(() => {
    const departments = new Set(employees.map(emp => emp.department));
    return Array.from(departments);
  }, [employees]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set(employees.map(emp => emp.status.toString()));
    return Array.from(statuses);
  }, [employees]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employment Management</h1>
          <p className="text-muted-foreground">
            Manage employees, candidates, and employment records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setAddEmployeeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button variant="outline" onClick={() => setUploadResumeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="employees">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <EmployeeSearchBar onSearch={handleSearch} />
                <EmployeeFilters 
                  departments={availableDepartments}
                  statuses={availableStatuses}
                  onStatusChange={handleStatusFilter}
                  onDepartmentChange={handleDepartmentFilter}
                />
              </div>
              <EmployeesList 
                employees={filteredEmployees} 
                onEditEmployee={handleEditEmployee}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="resumes">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Link to="/add-employee" className="inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Employee from Resume
                  </Button>
                </Link>
              </div>
              <ResumesList 
                resumes={resumes} 
                onStatusChange={handleResumeStatusChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsSection
              reports={employeeReports}
              employees={employees}
            />
          </TabsContent>
        </div>
      </Tabs>

      <AddEmployeeModal
        open={addEmployeeOpen}
        onClose={() => setAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <UploadResumeModal
        open={uploadResumeOpen}
        onClose={() => setUploadResumeOpen(false)}
        onUploadResume={handleUploadResume}
      />

      {selectedEmployee && (
        <EditEmployeeModal
          open={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          onEmployeeUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
};

export default Employed;
