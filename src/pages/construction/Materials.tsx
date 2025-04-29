
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, LayersIcon, ArchiveIcon, AlertCircleIcon } from "lucide-react";
import { AddConstructionItemModal } from "@/components/construction/AddConstructionItemModal";
import { toast } from "sonner";

interface Material {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export default function Materials() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: "Cement", quantity: 500, unit: "bags", status: "In Stock", lastUpdated: "2023-04-15" },
    { id: 2, name: "Sand", quantity: 200, unit: "tons", status: "In Stock", lastUpdated: "2023-04-10" },
    { id: 3, name: "Gravel", quantity: 50, unit: "tons", status: "Low Stock", lastUpdated: "2023-04-05" },
    { id: 4, name: "Steel Rods", quantity: 1000, unit: "pieces", status: "In Stock", lastUpdated: "2023-04-12" },
    { id: 5, name: "Bricks", quantity: 0, unit: "pieces", status: "Out of Stock", lastUpdated: "2023-03-30" },
  ]);

  // Calculate summary stats
  const inStockCount = materials.filter(item => item.status === "In Stock").length;
  const lowStockCount = materials.filter(item => item.status === "Low Stock").length;
  const outOfStockCount = materials.filter(item => item.status === "Out of Stock").length;

  const handleAddMaterial = (data: any) => {
    const quantity = parseInt(data.quantity);
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
    
    if (quantity === 0) {
      status = "Out of Stock";
    } else if (quantity < 50) {
      status = "Low Stock";
    }
    
    const newMaterial: Material = {
      id: materials.length + 1,
      name: data.name,
      description: data.description,
      quantity: quantity,
      unit: data.unit,
      status: status,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setMaterials([...materials, newMaterial]);
    toast.success("Material added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials Management</h1>
          <p className="text-muted-foreground">Track and manage construction materials</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Add Material</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">In Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-3">
                <LayersIcon className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inStockCount}</div>
                <div className="text-sm text-muted-foreground">Materials Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <ArchiveIcon className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowStockCount}</div>
                <div className="text-sm text-muted-foreground">Need Restocking Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircleIcon className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">{outOfStockCount}</div>
                <div className="text-sm text-muted-foreground">Need Immediate Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Material Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">#{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddConstructionItemModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        type="material"
        onSubmit={handleAddMaterial}
      />
    </div>
  );
}
