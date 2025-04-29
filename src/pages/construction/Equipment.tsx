
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TruckIcon, CalendarIcon, AlertTriangleIcon, CheckCircle2Icon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const dummyEquipment = [
  {
    id: "eq-001",
    name: "Excavator CAT 320",
    type: "Heavy Machinery",
    status: "operational",
    lastService: "2025-03-15",
    nextService: "2025-05-15",
    assignedTo: "City Center Tower",
    operator: "John Smith"
  },
  {
    id: "eq-002",
    name: "Cement Mixer XL5000",
    type: "Heavy Machinery",
    status: "maintenance",
    lastService: "2025-04-02",
    nextService: "2025-04-20",
    assignedTo: "Warehouse",
    operator: "N/A"
  },
  {
    id: "eq-003",
    name: "Tower Crane HC80",
    type: "Heavy Machinery",
    status: "operational",
    lastService: "2025-02-28",
    nextService: "2025-04-28",
    assignedTo: "Riverfront Residences",
    operator: "Sarah Johnson"
  },
  {
    id: "eq-004",
    name: "Bulldozer D8T",
    type: "Heavy Machinery",
    status: "operational",
    lastService: "2025-03-20",
    nextService: "2025-05-20",
    assignedTo: "Metro Hospital Expansion",
    operator: "Mike Wilson"
  },
  {
    id: "eq-005",
    name: "Concrete Pump Truck",
    type: "Vehicle",
    status: "repair",
    lastService: "2025-01-15",
    nextService: "2025-04-10",
    assignedTo: "Garage",
    operator: "N/A"
  }
];

const Equipment = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Management</h1>
          <p className="text-muted-foreground">Track and manage your construction equipment fleet</p>
        </div>
        <Button>
          <TruckIcon className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyEquipment.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyEquipment.filter(eq => eq.status === 'operational').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyEquipment.filter(eq => eq.status === 'maintenance').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Repair</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyEquipment.filter(eq => eq.status === 'repair').length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="heavy">Heavy Machinery</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicles</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center">
          <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input placeholder="Search equipment..." className="w-[250px]" />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyEquipment.map(equipment => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-medium">{equipment.name}</TableCell>
                  <TableCell>{equipment.type}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      equipment.status === 'operational' ? 'bg-green-100 text-green-800' : 
                      equipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {equipment.status === 'operational' ? <CheckCircle2Icon className="h-3 w-3 mr-1" /> : 
                       equipment.status === 'maintenance' ? <CalendarIcon className="h-3 w-3 mr-1" /> :
                       <AlertTriangleIcon className="h-3 w-3 mr-1" />}
                      {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(equipment.lastService).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(equipment.nextService).toLocaleDateString()}</TableCell>
                  <TableCell>{equipment.assignedTo}</TableCell>
                  <TableCell>{equipment.operator}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
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

export default Equipment;
