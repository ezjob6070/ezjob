
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Employee, EmployeeProject } from "@/types/employee";
import { format, isValid, parseISO } from "date-fns";
import { Briefcase, Calendar } from "lucide-react";

interface EmployeeProjectsProps {
  employee: Employee;
}

const EmployeeProjects: React.FC<EmployeeProjectsProps> = ({ employee }) => {
  // Generate sample projects if none exist
  const projects = employee.projects || [
    {
      id: "proj-1",
      name: "Website Redesign",
      role: "Project Lead",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      status: "completed",
      description: "Complete overhaul of company website with updated branding."
    },
    {
      id: "proj-2",
      name: "Client Portal",
      role: "Developer",
      startDate: "2024-04-10",
      status: "active",
      description: "Building a secure client portal for document sharing."
    },
    {
      id: "proj-3",
      name: "Mobile App Development",
      role: "Designer",
      startDate: "2024-05-01",
      status: "active",
      description: "Creating UI/UX for new company mobile application."
    }
  ] as EmployeeProject[];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Ongoing";
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 border-green-200";
      case 'completed':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'on-hold':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'cancelled':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Projects & Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>{project.name}</div>
                    {project.description && (
                      <div className="text-xs text-muted-foreground mt-1">{project.description}</div>
                    )}
                  </TableCell>
                  <TableCell>{project.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadgeVariant(project.status)}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No projects assigned to this employee yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeProjects;
