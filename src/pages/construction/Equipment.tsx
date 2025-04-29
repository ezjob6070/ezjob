
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Construction, WrenchIcon, PlusIcon } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";

interface EquipmentItem {
  id: number;
  name: string;
  description?: string;
  status: "Available" | "In Use" | "Under Repair";
  lastMaintenance: string;
  nextMaintenance: string;
}

export default function Equipment() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([
    { id: 1, name: "Excavator", status: "Available", lastMaintenance: "2023-04-10", nextMaintenance: "2023-07-10" },
    { id: 2, name: "Bulldozer", status: "In Use", lastMaintenance: "2023-03-15", nextMaintenance: "2023-06-15" },
    { id: 3, name: "Crane", status: "Under Repair", lastMaintenance: "2023-02-20", nextMaintenance: "2023-05-20" },
    { id: 4, name: "Concrete Mixer", status: "Available", lastMaintenance: "2023-04-05", nextMaintenance: "2023-07-05" },
    { id: 5, name: "Forklift", status: "In Use", lastMaintenance: "2023-03-25", nextMaintenance: "2023-06-25" },
  ]);

  // Calculate summary stats
  const availableCount = equipmentItems.filter(item => item.status === "Available").length;
  const underRepairCount = equipmentItems.filter(item => item.status === "Under Repair").length;
  const maintenanceDueCount = 3; // Mock value, would be calculated based on dates

  const handleAddEquipment = (data: any) => {
    // Calculate next maintenance date (3 months after last maintenance)
    const lastDate = data.lastMaintenance ? new Date(data.lastMaintenance) : new Date();
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 3);
    
    const newEquipment: EquipmentItem = {
      id: equipmentItems.length + 1,
      name: data.name,
      description: data.description,
      status: data.status as "Available" | "In Use" | "Under Repair",
      lastMaintenance: lastDate.toISOString().split('T')[0],
      nextMaintenance: nextDate.toISOString().split('T')[0],
    };
    
    setEquipmentItems([...equipmentItems, newEquipment]);
    toast.success("Equipment added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Management</h1>
          <p className="text-muted-foreground">Manage and track construction equipment</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Add Equipment</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equipment Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <Truck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableCount}</div>
                <div className="text-sm text-muted-foreground">Available Equipment</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Due</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <WrenchIcon className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{maintenanceDueCount}</div>
                <div className="text-sm text-muted-foreground">Maintenance Required</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Under Repair</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-full p-3">
                <Construction className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{underRepairCount}</div>
                <div className="text-sm text-muted-foreground">Items Being Repaired</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Next Maintenance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">#{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      item.status === 'Available' ? 'bg-green-100 text-green-700' :
                      item.status === 'In Use' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.lastMaintenance}</TableCell>
                  <TableCell>{item.nextMaintenance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddConstructionItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="equipment"
        onSubmit={handleAddEquipment}
      />
    </div>
  );
}
