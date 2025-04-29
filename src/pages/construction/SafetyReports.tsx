
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HardHatIcon, SearchIcon, FileTextIcon, TrendingDownIcon, TrendingUpIcon, ShieldAlertIcon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";

const dummySafetyReports = [
  {
    id: "sr-001",
    title: "Monthly Safety Inspection",
    project: "City Center Tower",
    submittedBy: "Robert Johnson",
    submitDate: "2025-04-10",
    type: "inspection",
    status: "completed",
    severity: "low",
    findings: 3,
    resolved: 3
  },
  {
    id: "sr-002",
    title: "Equipment Safety Violation",
    project: "Metro Hospital Expansion",
    submittedBy: "Sarah Wilson",
    submitDate: "2025-04-08",
    type: "incident",
    status: "in-review",
    severity: "high",
    findings: 1,
    resolved: 0
  },
  {
    id: "sr-003",
    title: "Weekly Safety Walkthrough",
    project: "Riverfront Residences",
    submittedBy: "Michael Chen",
    submitDate: "2025-04-05",
    type: "inspection",
    status: "completed",
    severity: "low",
    findings: 2,
    resolved: 2
  },
  {
    id: "sr-004",
    title: "Fall Protection Compliance",
    project: "City Center Tower",
    submittedBy: "Robert Johnson",
    submitDate: "2025-04-02",
    type: "audit",
    status: "completed",
    severity: "medium",
    findings: 4,
    resolved: 3
  },
  {
    id: "sr-005",
    title: "Chemical Spill Incident",
    project: "Metro Hospital Expansion",
    submittedBy: "Lisa Rodriguez",
    submitDate: "2025-03-28",
    type: "incident",
    status: "in-progress",
    severity: "high",
    findings: 1,
    resolved: 0
  },
  {
    id: "sr-006",
    title: "Scaffolding Safety Check",
    project: "Riverfront Residences",
    submittedBy: "John Williams",
    submitDate: "2025-03-25",
    type: "inspection",
    status: "completed",
    severity: "medium",
    findings: 2,
    resolved: 2
  },
];

const SafetyReports = () => {
  // Calculate stats
  const incidentCount = dummySafetyReports.filter(report => report.type === 'incident').length;
  const openIssues = dummySafetyReports.reduce((total, report) => total + (report.findings - report.resolved), 0);
  const findingsCount = dummySafetyReports.reduce((total, report) => total + report.findings, 0);
  const resolvedCount = dummySafetyReports.reduce((total, report) => total + report.resolved, 0);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety Reports</h1>
          <p className="text-muted-foreground">Track and manage safety incidents and inspections</p>
        </div>
        <Button>
          <FileTextIcon className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummySafetyReports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Incident Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidentCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Safety Issues</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-amber-600">{openIssues}</div>
            {openIssues > 0 && <AlertTriangleIcon className="h-5 w-5 ml-2 text-amber-500" />}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">
              {findingsCount > 0 ? Math.round((resolvedCount / findingsCount) * 100) : 0}%
            </div>
            {findingsCount > 0 && (resolvedCount / findingsCount) > 0.8 ? (
              <TrendingUpIcon className="h-5 w-5 ml-2 text-green-500" />
            ) : (
              <TrendingDownIcon className="h-5 w-5 ml-2 text-amber-500" />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="incident">Incidents</SelectItem>
              <SelectItem value="inspection">Inspections</SelectItem>
              <SelectItem value="audit">Audits</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="city-tower">City Center Tower</SelectItem>
              <SelectItem value="riverfront">Riverfront Residences</SelectItem>
              <SelectItem value="hospital">Metro Hospital Expansion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input placeholder="Search reports..." className="w-[250px]" />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummySafetyReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.project}</TableCell>
                  <TableCell>
                    {report.type === 'incident' ? (
                      <span className="inline-flex items-center">
                        <ShieldAlertIcon className="h-4 w-4 mr-1 text-red-500" />
                        Incident
                      </span>
                    ) : report.type === 'inspection' ? (
                      <span className="inline-flex items-center">
                        <HardHatIcon className="h-4 w-4 mr-1 text-blue-500" />
                        Inspection
                      </span>
                    ) : (
                      <span className="inline-flex items-center">
                        <CheckCircle2Icon className="h-4 w-4 mr-1 text-green-500" />
                        Audit
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.severity === 'low' ? 'bg-green-100 text-green-800' : 
                      report.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {report.status === 'completed' ? 'Completed' : 
                       report.status === 'in-progress' ? 'In Progress' : 
                       'In Review'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.resolved}/{report.findings} Resolved
                  </TableCell>
                  <TableCell>{new Date(report.submitDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyReports;
