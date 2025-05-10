
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusIcon, DollarSign, Briefcase, Package, Truck } from "lucide-react";
import { Project, ProjectExpense, ProjectContractor, ProjectMaterial, ProjectEquipment } from "@/types/project";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { toast } from "sonner";

interface ProjectFinanceTabProps {
  project: Project;
}

export default function ProjectFinanceTab({ project }: ProjectFinanceTabProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState<ProjectExpense[]>(project.expenses || []);
  const [contractors, setContractors] = useState<ProjectContractor[]>(project.contractors || []);
  const [materials, setMaterials] = useState<ProjectMaterial[]>(project.materials || []);
  const [equipment, setEquipment] = useState<ProjectEquipment[]>(project.equipment || []);

  // Financial summary calculations
  const totalRevenue = project.revenue || 0;
  const totalExpenses = calculateTotalExpenses();
  const netProfit = totalRevenue - totalExpenses;

  function calculateTotalExpenses(): number {
    const expensesTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const contractorsTotal = contractors.reduce((sum, con) => sum + con.totalPaid, 0);
    const materialsTotal = materials.reduce((sum, mat) => sum + mat.totalPrice, 0);
    const equipmentTotal = equipment.reduce((sum, eq) => sum + eq.totalCost, 0);
    
    return expensesTotal + contractorsTotal + materialsTotal + equipmentTotal;
  }

  const handleAddExpense = (data: Omit<ProjectExpense, "id">) => {
    const newExpense: ProjectExpense = {
      ...data,
      id: `expense-${Date.now()}`
    };
    setExpenses([...expenses, newExpense]);
    toast.success("Expense added successfully");
  };

  const handleAddContractor = (data: Omit<ProjectContractor, "id">) => {
    const newContractor: ProjectContractor = {
      ...data,
      id: `contractor-${Date.now()}`
    };
    setContractors([...contractors, newContractor]);
    toast.success("Contractor added successfully");
  };

  const handleAddMaterial = (data: Omit<ProjectMaterial, "id">) => {
    const newMaterial: ProjectMaterial = {
      ...data,
      id: `material-${Date.now()}`
    };
    setMaterials([...materials, newMaterial]);
    toast.success("Material added successfully");
  };

  const handleAddEquipment = (data: Omit<ProjectEquipment, "id">) => {
    const newEquipment: ProjectEquipment = {
      ...data,
      id: `equipment-${Date.now()}`
    };
    setEquipment([...equipment, newEquipment]);
    toast.success("Equipment added successfully");
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/70 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/70">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100/70 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900/70">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="bg-red-200 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? "from-green-50 to-green-100/70 border-green-200" : "from-red-50 to-red-100/70 border-red-200"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900/70">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {formatCurrency(netProfit)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${netProfit >= 0 ? "bg-green-200" : "bg-red-200"}`}>
                <DollarSign className={`h-5 w-5 ${netProfit >= 0 ? "text-green-700" : "text-red-700"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finance Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Financial Overview</h3>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
              <CardDescription>Comparing budget allocation with actual expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Budget</span>
                    <span className="text-sm">{formatCurrency(project.budget)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Actual Spent</span>
                    <span className="text-sm">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1">
                    <div 
                      className={`h-2 ${totalExpenses > project.budget ? 'bg-red-500' : 'bg-green-500'} rounded-full`} 
                      style={{ width: `${Math.min(100, (totalExpenses / project.budget) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Remaining Budget</span>
                    <span className={`font-medium ${project.budget - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(project.budget - totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">General Expenses</span>
                    <span className="font-medium">{formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Contractor Payments</span>
                    <span className="font-medium">{formatCurrency(contractors.reduce((sum, con) => sum + con.totalPaid, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Materials</span>
                    <span className="font-medium">{formatCurrency(materials.reduce((sum, mat) => sum + mat.totalPrice, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Equipment</span>
                    <span className="font-medium">{formatCurrency(equipment.reduce((sum, eq) => sum + eq.totalCost, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-3xl font-bold">
                    {project.budget > 0 
                      ? `${Math.round((totalExpenses / project.budget) * 100)}%` 
                      : '0%'}
                  </div>
                  <div className="text-sm text-muted-foreground">of budget utilized</div>
                  
                  <div className={`mt-2 text-sm ${
                    totalExpenses > project.budget 
                      ? 'text-red-600' 
                      : totalExpenses > project.budget * 0.9 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                  }`}>
                    {totalExpenses > project.budget 
                      ? 'Over budget' 
                      : totalExpenses > project.budget * 0.9 
                        ? 'Approaching budget limit' 
                        : 'Within budget'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Expenses</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                
                <AddExpenseForm onSubmit={handleAddExpense} />
              </DialogContent>
            </Dialog>
          </div>
          
          <ExpensesTable expenses={expenses} />
        </TabsContent>
        
        {/* Contractors Tab */}
        <TabsContent value="contractors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Contractors</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Contractor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contractor</DialogTitle>
                </DialogHeader>
                
                <AddContractorForm onSubmit={handleAddContractor} />
              </DialogContent>
            </Dialog>
          </div>
          
          <ContractorsTable contractors={contractors} />
        </TabsContent>
        
        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Materials</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                </DialogHeader>
                
                <AddMaterialForm onSubmit={handleAddMaterial} />
              </DialogContent>
            </Dialog>
          </div>
          
          <MaterialsTable materials={materials} />
        </TabsContent>
        
        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Equipment</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                
                <AddEquipmentForm onSubmit={handleAddEquipment} />
              </DialogContent>
            </Dialog>
          </div>
          
          <EquipmentTable equipment={equipment} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Form Components
function AddExpenseForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'general',
    description: '',
    paymentMethod: 'card',
    status: 'paid'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // In a real app, you would reset the form or close the dialog
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Expense Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Amount</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full border rounded p-2 mt-1"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="labor">Labor</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
              <option value="permits">Permits & Fees</option>
              <option value="utilities">Utilities</option>
              <option value="transport">Transportation</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <select
              className="w-full border rounded p-2 mt-1"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2 mt-1"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded p-2 mt-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Expense</Button>
    </form>
  );
}

function AddContractorForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rate: 0,
    rateType: 'hourly',
    totalPaid: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    contact: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Contractor Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Role</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Plumber, Electrician"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Rate</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Rate Type</label>
            <select
              className="w-full border rounded p-2 mt-1"
              name="rateType"
              value={formData.rateType}
              onChange={handleChange}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">End Date</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Total Paid</label>
          <input
            className="w-full border rounded p-2 mt-1"
            type="number"
            name="totalPaid"
            value={formData.totalPaid}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded p-2 mt-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Contractor</Button>
    </form>
  );
}

function AddMaterialForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    category: 'building',
    status: 'delivered'
  });

  const calculateTotal = () => {
    return formData.quantity * formData.unitPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalPrice: calculateTotal()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Auto-calculate total price when quantity or unitPrice changes
      ...(name === 'quantity' || name === 'unitPrice' ? {
        totalPrice: Number(name === 'quantity' ? value : prev.quantity) * Number(name === 'unitPrice' ? value : prev.unitPrice)
      } : {})
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Material Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Unit Price</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Total Price</label>
          <input
            className="w-full border rounded p-2 mt-1 bg-gray-50"
            type="number"
            value={calculateTotal()}
            readOnly
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Purchase Date</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full border rounded p-2 mt-1"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="building">Building Materials</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="flooring">Flooring</option>
              <option value="fixtures">Fixtures</option>
              <option value="paint">Paint & Finishes</option>
              <option value="hardware">Hardware</option>
              <option value="landscaping">Landscaping</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Supplier</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded p-2 mt-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="ordered">Ordered</option>
            <option value="delivered">Delivered</option>
            <option value="used">Used</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Material</Button>
    </form>
  );
}

function AddEquipmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    isRental: true,
    rentalCost: 0,
    purchaseCost: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    totalCost: 0,
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let totalCost = formData.isRental 
      ? formData.rentalCost 
      : formData.purchaseCost;
      
    onSubmit({
      ...formData,
      totalCost
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Equipment Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Equipment Type</label>
          <input
            className="w-full border rounded p-2 mt-1"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Excavator, Crane, Generator"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRental"
            name="isRental"
            checked={formData.isRental}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isRental" className="text-sm font-medium">This is a rental equipment</label>
        </div>
        
        {formData.isRental ? (
          <>
            <div>
              <label className="text-sm font-medium">Rental Cost</label>
              <input
                className="w-full border rounded p-2 mt-1"
                type="number"
                name="rentalCost"
                value={formData.rentalCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="text-sm font-medium">Purchase Cost</label>
            <input
              className="w-full border rounded p-2 mt-1"
              type="number"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full border rounded p-2 mt-1"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            {formData.isRental ? <option value="returned">Returned</option> : <option value="owned">Owned</option>}
          </select>
        </div>
      </div>
      
      <Button type="submit" className="w-full">Add Equipment</Button>
    </form>
  );
}

// Table Components
function ExpensesTable({ expenses }: { expenses: ProjectExpense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No expenses recorded yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Click "Add Expense" to record project expenses.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Payment Method</th>
            <th className="p-3 text-right">Amount</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{expense.name}</td>
              <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
              <td className="p-3 capitalize">{expense.category}</td>
              <td className="p-3 capitalize">{expense.paymentMethod}</td>
              <td className="p-3 text-right">{formatCurrency(expense.amount)}</td>
              <td className="p-3">
                <div className="flex justify-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    expense.status === 'paid' ? 'bg-green-100 text-green-800' :
                    expense.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {expense.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContractorsTable({ contractors }: { contractors: ProjectContractor[] }) {
  if (contractors.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No contractors added yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Click "Add Contractor" to add project contractors.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Rate</th>
            <th className="p-3 text-left">Period</th>
            <th className="p-3 text-right">Total Paid</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map(contractor => (
            <tr key={contractor.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{contractor.name}</td>
              <td className="p-3">{contractor.role}</td>
              <td className="p-3">
                {formatCurrency(contractor.rate)}/{contractor.rateType === 'hourly' ? 'hr' : contractor.rateType === 'daily' ? 'day' : 'fixed'}
              </td>
              <td className="p-3">
                {new Date(contractor.startDate).toLocaleDateString()} 
                {contractor.endDate && ` - ${new Date(contractor.endDate).toLocaleDateString()}`}
              </td>
              <td className="p-3 text-right">{formatCurrency(contractor.totalPaid)}</td>
              <td className="p-3">
                <div className="flex justify-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contractor.status === 'active' ? 'bg-green-100 text-green-800' :
                    contractor.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {contractor.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MaterialsTable({ materials }: { materials: ProjectMaterial[] }) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No materials recorded yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Click "Add Material" to record project materials.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-right">Quantity</th>
            <th className="p-3 text-right">Unit Price</th>
            <th className="p-3 text-right">Total Price</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {materials.map(material => (
            <tr key={material.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{material.name}</td>
              <td className="p-3 capitalize">{material.category}</td>
              <td className="p-3 text-right">{material.quantity}</td>
              <td className="p-3 text-right">{formatCurrency(material.unitPrice)}</td>
              <td className="p-3 text-right">{formatCurrency(material.totalPrice)}</td>
              <td className="p-3">
                <div className="flex justify-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    material.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    material.status === 'ordered' ? 'bg-amber-100 text-amber-800' :
                    material.status === 'used' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {material.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EquipmentTable({ equipment }: { equipment: ProjectEquipment[] }) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No equipment recorded yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Click "Add Equipment" to record project equipment.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-center">Rental</th>
            <th className="p-3 text-left">Period</th>
            <th className="p-3 text-right">Cost</th>
            <th className="p-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.type}</td>
              <td className="p-3 text-center">{item.isRental ? "Yes" : "No"}</td>
              <td className="p-3">
                {item.isRental ? (
                  <>
                    {item.startDate && new Date(item.startDate).toLocaleDateString()}
                    {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
                  </>
                ) : "-"}
              </td>
              <td className="p-3 text-right">{formatCurrency(item.totalCost)}</td>
              <td className="p-3">
                <div className="flex justify-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                    item.status === 'returned' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
