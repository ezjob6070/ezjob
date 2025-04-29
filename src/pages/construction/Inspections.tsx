
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardCheck, CheckCircle2, XCircle, PlusIcon, Clock } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";

interface Inspection {
  id: number;
  project: string;
  type: string;
  description?: string;
  date: string;
  inspector: string;
  status: "Scheduled" | "Completed" | "Failed" | "Postponed";
  notes?: string;
}

export default function Inspections() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([
    { id: 1, project: "City Center Tower - Phase 1", type: "Structural", date: "2023-04-15", inspector: "James Wilson", status: "Scheduled" },
    { id: 2, project: "City Center Tower - Phase 2", type: "Electrical", date: "2023-04-10", inspector: "Emily Davis", status: "Completed", notes: "All systems functioning correctly" },
    { id: 3, project: "City Center Tower - Phase 1", type: "Plumbing", date: "2023-04-05", inspector: "Michael Brown", status: "Failed", notes: "Leak detected in basement piping" },
    { id: 4, project: "City Center Tower - Phase 3", type: "HVAC", date: "2023-04-20", inspector: "Jessica Miller", status: "Scheduled" },
    { id: 5, project: "City Center Tower - Phase 2", type: "Fire Safety", date: "2023-04-01", inspector: "Daniel Johnson", status: "Completed", notes: "All fire systems operational" },
  ]);

  // Calculate summary stats
  const scheduledCount = inspections.filter(item => item.status === "Scheduled").length;
  const completedCount = inspections.filter(item => item.status === "Completed").length;
  const failedCount = inspections.filter(item => item.status === "Failed").length;

  const handleAddInspection = (data: any) => {
    const newInspection: Inspection = {
      id: inspections.length + 1,
      project: data.project,
      type: data.name,
      description: data.description || "",
      date: data.date,
      inspector: "To Be Assigned", // In a real app, this might be selected or assigned
      status: "Scheduled",
    };
    
    setInspections([...inspections, newInspection]);
    toast.success("Inspection scheduled successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Schedule and track project inspections</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Schedule Inspection</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{scheduledCount}</div>
                <div className="text-sm text-muted-foreground">Upcoming Inspections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Passed Inspections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Failed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{failedCount}</div>
                <div className="text-sm text-muted-foreground">Need Corrections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspections List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">#{inspection.id}</TableCell>
                  <TableCell>{inspection.project}</TableCell>
                  <TableCell>{inspection.type}</TableCell>
                  <TableCell>{inspection.date}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      inspection.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      inspection.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      inspection.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inspection.status}
                    </span>
                  </TableCell>
                  <TableCell>{inspection.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddConstructionItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="inspection"
        onSubmit={handleAddInspection}
      />
    </div>
  );
}
