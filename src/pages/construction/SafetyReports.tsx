
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, AlertTriangle, CheckCircle, PlusIcon, HardHatIcon } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";

interface SafetyReport {
  id: number;
  project: string;
  description: string;
  date: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  reportedBy: string;
}

export default function SafetyReports() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([
    { id: 1, project: "City Center Tower - Phase 1", description: "Exposed electrical wiring near elevator shaft", date: "2023-04-10", severity: "High", status: "In Progress", reportedBy: "John Doe" },
    { id: 2, project: "City Center Tower - Phase 2", description: "Missing guardrails on 3rd floor", date: "2023-04-05", severity: "Medium", status: "Open", reportedBy: "Jane Smith" },
    { id: 3, project: "City Center Tower - Phase 1", description: "Improper storage of flammable materials", date: "2023-04-01", severity: "High", status: "Resolved", reportedBy: "Mike Johnson" },
    { id: 4, project: "City Center Tower - Phase 3", description: "Trip hazard in stairwell", date: "2023-03-28", severity: "Low", status: "Resolved", reportedBy: "Sarah Williams" },
    { id: 5, project: "City Center Tower - Phase 2", description: "Inadequate ventilation in basement", date: "2023-03-25", severity: "Medium", status: "In Progress", reportedBy: "Robert Brown" },
  ]);

  // Calculate summary stats
  const openCount = safetyReports.filter(item => item.status === "Open").length;
  const inProgressCount = safetyReports.filter(item => item.status === "In Progress").length;
  const resolvedCount = safetyReports.filter(item => item.status === "Resolved").length;

  const handleAddSafetyReport = (data: any) => {
    const newReport: SafetyReport = {
      id: safetyReports.length + 1,
      project: data.project,
      description: data.description || "",
      date: data.date,
      severity: data.severity as "Low" | "Medium" | "High",
      status: "Open",
      reportedBy: "Current User", // In a real app, this would come from authentication
    };
    
    setSafetyReports([...safetyReports, newReport]);
    toast.success("Safety report submitted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety Reports</h1>
          <p className="text-muted-foreground">Track and manage safety issues across projects</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Report Safety Issue</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Issues</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{openCount}</div>
                <div className="text-sm text-muted-foreground">Require Action</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <ShieldAlert className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inProgressCount}</div>
                <div className="text-sm text-muted-foreground">Being Addressed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resolvedCount}</div>
                <div className="text-sm text-muted-foreground">Issues Fixed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Safety Reports List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Reported By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safetyReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">#{report.id}</TableCell>
                  <TableCell>{report.project}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      report.severity === 'Low' ? 'bg-green-100 text-green-700' :
                      report.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      report.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                      report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddConstructionItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="safety-report"
        onSubmit={handleAddSafetyReport}
      />
    </div>
  );
}
