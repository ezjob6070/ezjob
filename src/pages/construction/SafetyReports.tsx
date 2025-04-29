
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HardHatIcon } from "lucide-react";

export default function SafetyReports() {
  const reports = [
    { id: 1, projectName: "City Center Tower", date: "2023-04-15", violations: 0, incidents: 0, status: "Compliant" },
    { id: 2, projectName: "Harbor Bridge", date: "2023-04-12", violations: 2, incidents: 0, status: "Minor Violations" },
    { id: 3, projectName: "Residential Complex", date: "2023-04-10", violations: 0, incidents: 1, status: "Incident Reported" },
    { id: 4, projectName: "Office Plaza", date: "2023-04-08", violations: 5, incidents: 0, status: "Major Violations" },
    { id: 5, projectName: "Woodland Homes", date: "2023-04-05", violations: 0, incidents: 0, status: "Compliant" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety Reports</h1>
          <p className="text-muted-foreground">Monitor and manage safety compliance</p>
        </div>
        <Button className="gap-2">
          <HardHatIcon className="h-4 w-4" />
          <span>New Safety Report</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety Compliance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm text-muted-foreground">Overall compliance rate</div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Compliant Sites</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Incidents</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Incidents This Month</div>
              </div>
              <div>
                <div className="text-sm font-medium text-green-600">-50%</div>
                <div className="text-sm text-muted-foreground">From Last Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety Training</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Workers Fully Trained</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Safety Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Inspection Date</TableHead>
                <TableHead>Violations</TableHead>
                <TableHead>Incidents</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">#{report.id}</TableCell>
                  <TableCell>{report.projectName}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.violations}</TableCell>
                  <TableCell>{report.incidents}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      report.status === 'Compliant' ? 'bg-green-100 text-green-700' :
                      report.status === 'Minor Violations' ? 'bg-amber-100 text-amber-700' :
                      report.status === 'Incident Reported' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
