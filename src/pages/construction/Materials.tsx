
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayersIcon } from "lucide-react";

export default function Materials() {
  const materialsList = [
    { id: 1, name: "Cement", quantity: "120 bags", project: "City Center Tower", status: "In Stock" },
    { id: 2, name: "Steel Rebar", quantity: "5 tons", project: "Harbor Bridge", status: "Low Stock" },
    { id: 3, name: "Bricks", quantity: "3500 pcs", project: "Residential Complex", status: "In Stock" },
    { id: 4, name: "Sand", quantity: "8 cubic yards", project: "Multiple", status: "In Stock" },
    { id: 5, name: "Lumber", quantity: "200 boards", project: "Woodland Homes", status: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials Inventory</h1>
          <p className="text-muted-foreground">Manage construction materials and supplies</p>
        </div>
        <Button className="gap-2">
          <LayersIcon className="h-4 w-4" />
          <span>Add Materials</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Materials Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Different materials tracked</div>
            
            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>In Stock</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: "70%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Low Stock</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: "20%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Out of Stock</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Pending Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Arriving Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">+15%</div>
            <div className="text-sm text-muted-foreground">Compared to last month</div>
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
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Assigned Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materialsList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">#{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.project}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
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
