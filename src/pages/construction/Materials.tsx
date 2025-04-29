
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayersIcon, SearchIcon, PlusIcon, AlertCircleIcon } from "lucide-react";

const dummyMaterials = [
  {
    id: "mat-001",
    name: "Portland Cement",
    category: "Concrete",
    quantity: 250,
    unit: "bags",
    unitPrice: 12.50,
    supplier: "BuildCo Materials",
    location: "Main Warehouse",
    reorderPoint: 50,
    lastOrderDate: "2025-03-10"
  },
  {
    id: "mat-002",
    name: "Steel Rebars (20mm)",
    category: "Steel",
    quantity: 1200,
    unit: "rods",
    unitPrice: 35.75,
    supplier: "Steel Solutions Inc.",
    location: "Main Warehouse",
    reorderPoint: 200,
    lastOrderDate: "2025-02-18"
  },
  {
    id: "mat-003",
    name: "Plywood Sheets (18mm)",
    category: "Wood",
    quantity: 85,
    unit: "sheets",
    unitPrice: 42.00,
    supplier: "Timber Products",
    location: "Secondary Warehouse",
    reorderPoint: 20,
    lastOrderDate: "2025-03-22"
  },
  {
    id: "mat-004",
    name: "Bricks (Standard)",
    category: "Masonry",
    quantity: 3500,
    unit: "pieces",
    unitPrice: 0.85,
    supplier: "BuildCo Materials",
    location: "City Center Tower Site",
    reorderPoint: 500,
    lastOrderDate: "2025-04-05"
  },
  {
    id: "mat-005",
    name: "Ceramic Tiles (30x30cm)",
    category: "Flooring",
    quantity: 350,
    unit: "boxes",
    unitPrice: 28.50,
    supplier: "Design Surfaces",
    location: "Secondary Warehouse",
    reorderPoint: 40,
    lastOrderDate: "2025-03-15"
  },
  {
    id: "mat-006",
    name: "Copper Wiring (2.5mm²)",
    category: "Electrical",
    quantity: 18,
    unit: "rolls",
    unitPrice: 120.00,
    supplier: "ElectroSupply",
    location: "Main Warehouse",
    reorderPoint: 25,
    lastOrderDate: "2025-02-25"
  },
];

const Materials = () => {
  // Get materials that need reordering
  const lowStockMaterials = dummyMaterials.filter(mat => mat.quantity <= mat.reorderPoint);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials Inventory</h1>
          <p className="text-muted-foreground">Manage construction materials and inventory</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dummyMaterials.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(dummyMaterials.map(mat => mat.category)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {lowStockMaterials.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dummyMaterials.reduce((sum, mat) => sum + (mat.quantity * mat.unitPrice), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {lowStockMaterials.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-amber-800">
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              Materials Requiring Reorder
            </CardTitle>
            <CardDescription className="text-amber-700">
              The following materials have reached their reorder point
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockMaterials.map(mat => (
                <Badge key={mat.id} variant="outline" className="bg-white border-amber-300 text-amber-800">
                  {mat.name}: {mat.quantity} {mat.unit} remaining
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="wood">Wood</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="flooring">Flooring</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="main">Main Warehouse</SelectItem>
              <SelectItem value="secondary">Secondary Warehouse</SelectItem>
              <SelectItem value="site">Project Sites</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <SearchIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input placeholder="Search materials..." className="w-[250px]" />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyMaterials.map(material => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell className={material.quantity <= material.reorderPoint ? "text-amber-600 font-medium" : ""}>
                    {material.quantity} {material.unit}
                    {material.quantity <= material.reorderPoint && (
                      <AlertCircleIcon className="inline h-4 w-4 ml-1 text-amber-500" />
                    )}
                  </TableCell>
                  <TableCell>${material.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>${(material.quantity * material.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>{material.location}</TableCell>
                  <TableCell>{material.supplier}</TableCell>
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

export default Materials;
