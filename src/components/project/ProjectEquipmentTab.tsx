
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Package, Truck, DollarSign, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectEquipment, ProjectMaterial } from "@/types/project";

interface ProjectEquipmentTabProps {
  projectId: number;
  projectEquipment?: ProjectEquipment[];
  projectMaterials?: ProjectMaterial[];
}

const ProjectEquipmentTab: React.FC<ProjectEquipmentTabProps> = ({ 
  projectId, 
  projectEquipment: initialEquipment = [], 
  projectMaterials: initialMaterials = [] 
}) => {
  const [equipment, setEquipment] = useState<ProjectEquipment[]>(initialEquipment);
  const [materials, setMaterials] = useState<ProjectMaterial[]>(initialMaterials);
  const [activeTab, setActiveTab] = useState("all");
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<ProjectEquipment>>({
    isRental: true,
    status: "active",
  });
  const [newMaterial, setNewMaterial] = useState<Partial<ProjectMaterial>>({
    quantity: 1,
    status: "ordered",
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const rentalCost = newEquipment.isRental ? newEquipment.rentalCost || 0 : 0;
    const purchaseCost = !newEquipment.isRental ? newEquipment.purchaseCost || 0 : 0;
    const totalCost = newEquipment.isRental ? rentalCost : purchaseCost;

    const equipmentItem: ProjectEquipment = {
      id: `equip-${Date.now()}`,
      name: newEquipment.name || "",
      type: newEquipment.type || "",
      rentalCost,
      purchaseCost,
      isRental: newEquipment.isRental || false,
      startDate: newEquipment.startDate,
      endDate: newEquipment.endDate,
      totalCost,
      status: newEquipment.status || "active"
    };

    setEquipment([...equipment, equipmentItem]);
    setShowAddEquipmentDialog(false);
    setNewEquipment({
      isRental: true,
      status: "active",
    });
    
    toast.success("Equipment added successfully");
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.unitPrice || newMaterial.quantity === undefined) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalPrice = (newMaterial.unitPrice || 0) * (newMaterial.quantity || 0);

    const materialItem: ProjectMaterial = {
      id: `mat-${Date.now()}`,
      name: newMaterial.name || "",
      quantity: newMaterial.quantity || 0,
      unitPrice: newMaterial.unitPrice || 0,
      totalPrice,
      supplier: newMaterial.supplier,
      purchaseDate: newMaterial.purchaseDate || new Date().toISOString().split('T')[0],
      category: newMaterial.category || "General",
      status: newMaterial.status || "ordered"
    };

    setMaterials([...materials, materialItem]);
    setShowAddMaterialDialog(false);
    setNewMaterial({
      quantity: 1,
      status: "ordered",
    });
    
    toast.success("Material added successfully");
  };

  const handleRemoveEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
    toast.success("Equipment removed");
  };
  
  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(item => item.id !== id));
    toast.success("Material removed");
  };

  const getStatusBadgeColor = (status: string, type: 'equipment' | 'material') => {
    if (type === 'equipment') {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case "returned":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "owned":
          return "bg-purple-100 text-purple-800 hover:bg-purple-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    } else {
      switch (status) {
        case "ordered":
          return "bg-amber-100 text-amber-800 hover:bg-amber-200";
        case "delivered":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "used":
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case "returned":
          return "bg-red-100 text-red-800 hover:bg-red-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    }
  };

  // Calculate totals and filter items based on active tab
  const totalEquipmentCost = equipment.reduce((sum, e) => sum + e.totalCost, 0);
  const totalMaterialsCost = materials.reduce((sum, m) => sum + m.totalPrice, 0);
  
  const filteredEquipment = activeTab === "all" || activeTab === "equipment" 
    ? equipment 
    : [];
  
  const filteredMaterials = activeTab === "all" || activeTab === "materials" 
    ? materials 
    : [];
  
  const countRentedEquipment = equipment.filter(e => e.isRental).length;
  const countOwnedEquipment = equipment.filter(e => !e.isRental).length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Project Equipment & Materials</h2>
        <div className="flex flex-wrap gap-2">
          <Dialog open={showAddMaterialDialog} onOpenChange={setShowAddMaterialDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Material</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name"
                      value={newMaterial.name || ""}
                      onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                      placeholder="Material name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category"
                      value={newMaterial.category || ""}
                      onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                      placeholder="E.g., Wood, Metal, Electrical"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input 
                      id="quantity"
                      type="number"
                      value={newMaterial.quantity || 1}
                      onChange={(e) => setNewMaterial({...newMaterial, quantity: parseFloat(e.target.value)})}
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                    <Input 
                      id="unitPrice"
                      type="number"
                      value={newMaterial.unitPrice || ""}
                      onChange={(e) => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value)})}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newMaterial.status} 
                      onValueChange={(value: "ordered" | "delivered" | "used" | "returned") => 
                        setNewMaterial({...newMaterial, status: value})
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordered">Ordered</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input 
                      id="supplier"
                      value={newMaterial.supplier || ""}
                      onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input 
                      id="purchaseDate"
                      type="date"
                      value={newMaterial.purchaseDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewMaterial({...newMaterial, purchaseDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMaterialDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMaterial}>
                  Add Material
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddEquipmentDialog} onOpenChange={setShowAddEquipmentDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Equipment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="equipment-name">Name *</Label>
                    <Input 
                      id="equipment-name"
                      value={newEquipment.name || ""}
                      onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                      placeholder="Equipment name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="equipment-type">Type *</Label>
                    <Input 
                      id="equipment-type"
                      value={newEquipment.type || ""}
                      onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
                      placeholder="E.g., Heavy, Light, Power Tool"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Equipment Type</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="rental" 
                        name="equipmentType" 
                        checked={newEquipment.isRental === true} 
                        onChange={() => setNewEquipment({...newEquipment, isRental: true})}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="rental" className="cursor-pointer">Rental</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="owned" 
                        name="equipmentType" 
                        checked={newEquipment.isRental === false} 
                        onChange={() => setNewEquipment({...newEquipment, isRental: false})}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="owned" className="cursor-pointer">Purchase</Label>
                    </div>
                  </div>
                </div>
                
                {newEquipment.isRental ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rentalCost">Rental Cost ($)</Label>
                      <Input 
                        id="rentalCost"
                        type="number"
                        value={newEquipment.rentalCost || ""}
                        onChange={(e) => setNewEquipment({...newEquipment, rentalCost: parseFloat(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newEquipment.status} 
                        onValueChange={(value: "active" | "returned" | "owned") => 
                          setNewEquipment({...newEquipment, status: value})
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate"
                        type="date"
                        value={newEquipment.startDate || ""}
                        onChange={(e) => setNewEquipment({...newEquipment, startDate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate"
                        type="date"
                        value={newEquipment.endDate || ""}
                        onChange={(e) => setNewEquipment({...newEquipment, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="purchaseCost">Purchase Cost ($)</Label>
                      <Input 
                        id="purchaseCost"
                        type="number"
                        value={newEquipment.purchaseCost || ""}
                        onChange={(e) => setNewEquipment({...newEquipment, purchaseCost: parseFloat(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="purchase-status">Status</Label>
                      <Select 
                        value={newEquipment.status} 
                        onValueChange={(value: "active" | "returned" | "owned") => 
                          setNewEquipment({...newEquipment, status: value})
                        }
                      >
                        <SelectTrigger id="purchase-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="active">In Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="purchase-date">Purchase Date</Label>
                      <Input 
                        id="purchase-date"
                        type="date"
                        value={newEquipment.startDate || ""}
                        onChange={(e) => setNewEquipment({...newEquipment, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddEquipmentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEquipment}>
                  Add Equipment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {(equipment.length > 0 || materials.length > 0) ? (
        <>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-md p-4 shadow-sm border">
                <div className="text-sm font-medium text-gray-500">Equipment</div>
                <div className="text-2xl font-bold mt-1">{equipment.length}</div>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm border">
                <div className="text-sm font-medium text-gray-500">Materials</div>
                <div className="text-2xl font-bold mt-1">{materials.length}</div>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm border">
                <div className="text-sm font-medium text-gray-500">Equipment Cost</div>
                <div className="text-2xl font-bold mt-1">${totalEquipmentCost.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm border">
                <div className="text-sm font-medium text-gray-500">Materials Cost</div>
                <div className="text-2xl font-bold mt-1">${totalMaterialsCost.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-gray-100/70">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Items ({equipment.length + materials.length})
              </TabsTrigger>
              <TabsTrigger value="equipment" className="data-[state=active]:bg-white">
                Equipment ({equipment.length})
              </TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-white">
                Materials ({materials.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {/* Equipment Section */}
            {filteredEquipment.length > 0 && (
              <div className="space-y-4">
                {activeTab !== "materials" && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Equipment</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        <Badge variant="outline" className="font-normal">
                          {countRentedEquipment} Rented
                        </Badge>
                      </span>
                      <span className="text-gray-500">
                        <Badge variant="outline" className="font-normal">
                          {countOwnedEquipment} Owned
                        </Badge>
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEquipment.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50/70 pb-2 border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <Badge className={getStatusBadgeColor(item.status, 'equipment')}>
                            {item.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="px-3 py-2 bg-blue-50 rounded-md">
                            <p className="text-blue-800 font-medium">{item.type}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">{item.isRental ? 'Rental' : 'Owned'}</span>
                              <span className="font-medium">
                                ${item.totalCost.toLocaleString()}
                                {item.isRental && item.rentalCost && ' total'}
                              </span>
                            </div>
                            
                            {item.startDate && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar size={14} className="text-gray-400" />
                                <span>
                                  {item.isRental ? 'Rental start: ' : 'Purchase date: '}
                                  {item.startDate}
                                </span>
                              </div>
                            )}
                            
                            {item.isRental && item.endDate && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar size={14} className="text-gray-400" />
                                <span>Return by: {item.endDate}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-3 mt-2">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full flex items-center justify-center gap-1"
                              onClick={() => handleRemoveEquipment(item.id)}
                            >
                              <Trash2 size={14} />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Materials Section */}
            {filteredMaterials.length > 0 && (
              <div className="space-y-4">
                {activeTab !== "equipment" && (
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Materials</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        <Badge variant="outline" className="font-normal">
                          {materials.filter(m => m.status === "ordered").length} Ordered
                        </Badge>
                      </span>
                      <span className="text-gray-500">
                        <Badge variant="outline" className="font-normal">
                          {materials.filter(m => m.status === "delivered").length} Delivered
                        </Badge>
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMaterials.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50/70 pb-2 border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <Badge className={getStatusBadgeColor(item.status, 'material')}>
                            {item.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {item.category && (
                            <div className="px-3 py-2 bg-amber-50 rounded-md">
                              <p className="text-amber-800 font-medium">{item.category}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Quantity</span>
                              <span className="font-medium">{item.quantity} units</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Unit Price</span>
                              <span className="font-medium">${item.unitPrice.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span className="text-gray-700 font-medium">Total</span>
                              <span className="font-bold">${item.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {item.purchaseDate && (
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <Calendar size={14} className="text-gray-400" />
                              <span>Purchased: {item.purchaseDate}</span>
                            </div>
                          )}
                          
                          {item.supplier && (
                            <div className="text-sm mt-1">
                              <span className="text-gray-500">Supplier: </span>
                              <span>{item.supplier}</span>
                            </div>
                          )}
                          
                          <div className="pt-3 mt-2">
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-full flex items-center justify-center gap-1"
                              onClick={() => handleRemoveMaterial(item.id)}
                            >
                              <Trash2 size={14} />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Card className="border-dashed border-2 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Package size={32} className="text-gray-300" />
              <Truck size={32} className="text-gray-300" />
            </div>
            <p className="text-xl font-medium text-gray-500">No equipment or materials yet</p>
            <p className="text-gray-400 mb-6">Add equipment and materials needed for this project</p>
            <div className="flex gap-4">
              <Button onClick={() => setShowAddMaterialDialog(true)} variant="outline" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Add Material
              </Button>
              <Button onClick={() => setShowAddEquipmentDialog(true)} className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectEquipmentTab;
