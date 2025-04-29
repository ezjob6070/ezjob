
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheckIcon, SearchIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, CalendarIcon } from "lucide-react";

const dummyInspections = [
  {
    id: "insp-001",
    title: "Building Code Compliance",
    project: "City Center Tower",
    inspector: "Robert Chen",
    scheduledDate: "2025-04-15",
    status: "scheduled",
    type: "regulatory",
    priority: "high"
  },
  {
    id: "insp-002",
    title: "Electrical Systems",
    project: "Metro Hospital Expansion",
    inspector: "Lisa Rodriguez",
    scheduledDate: "2025-04-08",
    completedDate: "2025-04-08",
    status: "passed",
    type: "internal",
    priority: "medium",
    notes: "All electrical systems meet code requirements."
  },
  {
    id: "insp-003",
    title: "Foundation Inspection",
    project: "Riverfront Residences",
    inspector: "Michael Smith",
    scheduledDate: "2025-04-03",
    completedDate: "2025-04-03",
    status: "passed",
    type: "regulatory",
    priority: "high",
    notes: "Foundation meets all requirements."
  },
  {
    id: "insp-004",
    title: "Fire Safety Systems",
    project: "Metro Hospital Expansion",
    inspector: "John Williams",
    scheduledDate: "2025-03-28",
    completedDate: "2025-03-28",
    status: "failed",
    type: "regulatory",
    priority: "high",
    notes: "Sprinkler system requires adjustments. Re-inspection scheduled."
  },
  {
    id: "insp-005",
    title: "Plumbing Systems",
    project: "City Center Tower",
    inspector: "Sarah Johnson",
    scheduledDate: "2025-03-25",
    completedDate: "2025-03-25",
    status: "passed",
    type: "internal",
    priority: "medium",
    notes: "All plumbing installations passed inspection."
  },
  {
    id: "insp-006",
    title: "Structural Steel",
    project: "Riverfront Residences",
    inspector: "David Lee",
    scheduledDate: "2025-04-20",
    status: "scheduled",
    type: "internal",
    priority: "medium"
  }
];

const Inspections = () => {
  const passedCount = dummyInspections.filter(insp => insp.status === 'passed').length;
  const failedCount = dummyInspections.filter(insp => insp.status === 'failed').length;
  const scheduledCount = dummyInspections.filter(insp => insp.status === 'scheduled').length;
  const regulatoryCount = dummyInspections.filter(insp => insp.type === 'regulatory').length;
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground">Manage and track project inspections</p>
        </div>
        <Button>
          <ClipboardCheckIcon className="mr-2 h-4 w-4" /> Schedule Inspection
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyInspections.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <CalendarIcon className="h-5 w-5 ml-2 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Passed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <CheckCircleIcon className="h-5 w-5 ml-2 text-green-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <XCircleIcon className="h-5 w-5 ml-2 text-red-500" />
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Inspections</CardTitle>
          <CardDescription>Inspections scheduled for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyInspections
              .filter(insp => insp.status === 'scheduled')
              .map(inspection => (
                <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      inspection.priority === 'high' ? 'bg-red-100' : 
                      inspection.priority === 'medium' ? 'bg-amber-100' : 
                      'bg-blue-100'
                    }`}>
                      <ClipboardCheckIcon className={`h-5 w-5 ${
                        inspection.priority === 'high' ? 'text-red-500' : 
                        inspection.priority === 'medium' ? 'text-amber-500' : 
                        'text-blue-500'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{inspection.title}</div>
                      <div className="text-sm text-muted-foreground">{inspection.project}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(inspection.scheduledDate).toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                </div>
              ))}
            
            {dummyInspections.filter(insp => insp.status === 'scheduled').length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming inspections scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Inspections</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="internal">Internal</TabsTrigger>
          <TabsTrigger value="quality">Quality Assurance</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
          <Input placeholder="Search inspections..." className="w-[250px]" />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspection</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyInspections.map(inspection => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {inspection.priority === 'high' && (
                        <AlertTriangleIcon className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      {inspection.title}
                    </div>
                  </TableCell>
                  <TableCell>{inspection.project}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      inspection.type === 'regulatory' ? 'bg-purple-100 text-purple-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {inspection.type.charAt(0).toUpperCase() + inspection.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      inspection.status === 'passed' ? 'bg-green-100 text-green-800' : 
                      inspection.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {inspection.status === 'passed' ? (
                        <>
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Passed
                        </>
                      ) : inspection.status === 'failed' ? (
                        <>
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Failed
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Scheduled
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    {inspection.completedDate ? 
                      new Date(inspection.completedDate).toLocaleDateString() : 
                      new Date(inspection.scheduledDate).toLocaleDateString()}
                  </TableCell>
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

export default Inspections;
