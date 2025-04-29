
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardCheckIcon } from "lucide-react";

export default function Inspections() {
  const inspections = [
    { id: 1, projectName: "City Center Tower", type: "Structural", inspector: "John Smith", date: "2023-04-20", status: "Scheduled" },
    { id: 2, projectName: "Harbor Bridge", type: "Electrical", inspector: "Maria Johnson", date: "2023-04-15", status: "Completed" },
    { id: 3, projectName: "Residential Complex", type: "Plumbing", inspector: "Robert Chen", date: "2023-04-18", status: "Scheduled" },
    { id: 4, projectName: "Office Plaza", type: "Foundation", inspector: "Sarah Wilson", date: "2023-04-10", status: "Failed" },
    { id: 5, projectName: "Woodland Homes", type: "Final", inspector: "David Thompson", date: "2023-04-22", status: "Scheduled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Schedule and track project inspections</p>
        </div>
        <Button className="gap-2">
          <ClipboardCheckIcon className="h-4 w-4" />
          <span>Schedule Inspection</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspection Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Total Inspections</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Scheduled This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspection Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Passed</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: "67%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Scheduled</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Failed</span>
                  <span className="font-medium">8%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "8%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inspector Availability</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-muted-foreground">Inspectors Available</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">#{inspection.id}</TableCell>
                  <TableCell>{inspection.projectName}</TableCell>
                  <TableCell>{inspection.type}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>{inspection.date}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      inspection.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      inspection.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inspection.status}
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
