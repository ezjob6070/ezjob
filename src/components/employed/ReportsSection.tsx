
import { useState } from "react";
import { Employee, Report } from "@/types/employee";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Search, FileText, FileCheck, Clock } from "lucide-react";

interface ReportsSectionProps {
  reports: Report[];
  employees: Employee[];
}

const ReportsSection = ({ reports, employees }: ReportsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter reports based on search
  const filteredReports = reports.filter((report) => {
    const employee = employees.find(emp => emp.id === report.employeeId);
    const employeeName = employee ? employee.name : "";
    
    return report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           employeeName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : "Unknown Employee";
  };

  // Get report status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FileCheck size={16} className="text-green-500" />;
      case "in-progress":
        return <Clock size={16} className="text-amber-500" />;
      case "pending":
        return <FileText size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <FileCheck size={20} />
              <span>Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reports.filter(r => r.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">
              Reports completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Clock size={20} />
              <span>In Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reports.filter(r => r.status === "in-progress").length}
            </div>
            <p className="text-sm text-muted-foreground">
              Reports in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <FileText size={20} />
              <span>Pending</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reports.filter(r => r.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">
              Reports pending review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Title</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="font-medium">{report.title}</div>
                  </TableCell>
                  <TableCell>{getEmployeeName(report.employeeId)}</TableCell>
                  <TableCell>{format(report.dateSubmitted, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        report.status === "completed" ? "default" : 
                        report.status === "in-progress" ? "outline" : "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(report.status)}
                      <span>
                        {report.status.split("-").map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(" ")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No reports found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsSection;
