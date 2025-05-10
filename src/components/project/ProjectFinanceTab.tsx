
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // Added missing import
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Project, ProjectExpense, ProjectContractor, ProjectMaterial, ProjectEquipment } from "@/types/project";
import { ArrowUpRight, Banknote, Building2, ChevronRight, CircleDollarSign, FileText, ListChecks, Minus, ReceiptText, TrendingDown, TrendingUp, Truck } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const ProjectFinanceTab: React.FC<{ project: Project }> = ({ project }) => {
  // Initialize project with empty arrays for financial data if not present
  const projectWithFinanceData = {
    ...project,
    expenses: project.expenses || [],
    contractors: project.contractors || [],
    materials: project.materials || [],
    equipment: project.equipment || []
  };

  const [activeFinanceTab, setActiveFinanceTab] = useState("overview");
  
  // Form states
  const [newExpense, setNewExpense] = useState<Omit<ProjectExpense, 'id'>>({
    name: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: "general",
    status: "pending",
    description: ""
  });
  
  const [newContractor, setNewContractor] = useState<Omit<ProjectContractor, 'id'>>({
    name: "",
    role: "",
    rate: 0,
    rateType: "hourly",
    hoursWorked: 0,
    totalPaid: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: "active",
    contact: "",
    email: "",
    phone: ""
  });
  
  const [newMaterial, setNewMaterial] = useState<Omit<ProjectMaterial, 'id'>>({
    name: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    supplier: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    category: "general",
    status: "ordered"
  });
  
  const [newEquipment, setNewEquipment] = useState<Omit<ProjectEquipment, 'id'>>({
    name: "",
    type: "",
    isRental: true,
    rentalCost: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    totalCost: 0,
    status: "active"
  });

  // Calculation of financial metrics
  const totalExpenses = projectWithFinanceData.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const totalContractorCosts = projectWithFinanceData.contractors?.reduce((sum, c) => sum + c.totalPaid, 0) || 0;
  const totalMaterialCosts = projectWithFinanceData.materials?.reduce((sum, m) => sum + m.totalPrice, 0) || 0;
  const totalEquipmentCosts = projectWithFinanceData.equipment?.reduce((sum, e) => sum + e.totalCost, 0) || 0;
  
  const totalAllExpenses = totalExpenses + totalContractorCosts + totalMaterialCosts + totalEquipmentCosts;
  
  // Project's budget and revenue
  const budget = project.budget || 0;
  const revenue = project.revenue || 0;
  
  // Calculate profit or loss
  const netProfit = revenue - totalAllExpenses;
  const budgetRemaining = budget - totalAllExpenses;
  const budgetUsagePercentage = budget > 0 ? Math.round((totalAllExpenses / budget) * 100) : 0;
  const isProfitable = netProfit > 0;

  // Calculate category breakdowns for expenses
  const expensesCategories = projectWithFinanceData.expenses?.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  // Calculate status breakdowns for expenses
  const expensesStatus = projectWithFinanceData.expenses?.reduce((acc, expense) => {
    if (!acc[expense.status]) {
      acc[expense.status] = 0;
    }
    acc[expense.status] += expense.amount;
    return acc;
  }, { paid: 0, pending: 0, cancelled: 0 } as Record<string, number>);

  // Form handlers
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpenseItem: ProjectExpense = {
      ...newExpense,
      id: uuidv4()
    };
    
    // Logic to add expense would go here (API call, state update, etc.)
    console.log("Adding expense:", newExpenseItem);
    
    // Placeholder: Update local state
    // In a real application, you would make an API call to update the database
    projectWithFinanceData.expenses = [...(projectWithFinanceData.expenses || []), newExpenseItem];
    
    // Reset form and show success message
    setNewExpense({
      name: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: "general",
      status: "pending",
      description: ""
    });
    
    toast.success("Expense added successfully");
  };
  
  const handleContractorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContractorItem: ProjectContractor = {
      ...newContractor,
      id: uuidv4()
    };
    
    console.log("Adding contractor:", newContractorItem);
    projectWithFinanceData.contractors = [...(projectWithFinanceData.contractors || []), newContractorItem];
    
    setNewContractor({
      name: "",
      role: "",
      rate: 0,
      rateType: "hourly",
      hoursWorked: 0,
      totalPaid: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: "active",
      contact: "",
      email: "",
      phone: ""
    });
    
    toast.success("Contractor added successfully");
  };
  
  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate total price based on quantity and unit price
    const calculatedTotal = newMaterial.quantity * newMaterial.unitPrice;
    
    const newMaterialItem: ProjectMaterial = {
      ...newMaterial,
      totalPrice: calculatedTotal,
      id: uuidv4()
    };
    
    console.log("Adding material:", newMaterialItem);
    projectWithFinanceData.materials = [...(projectWithFinanceData.materials || []), newMaterialItem];
    
    setNewMaterial({
      name: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      supplier: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      category: "general",
      status: "ordered"
    });
    
    toast.success("Material added successfully");
  };
  
  const handleEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipmentItem: ProjectEquipment = {
      ...newEquipment,
      id: uuidv4()
    };
    
    console.log("Adding equipment:", newEquipmentItem);
    projectWithFinanceData.equipment = [...(projectWithFinanceData.equipment || []), newEquipmentItem];
    
    setNewEquipment({
      name: "",
      type: "",
      isRental: true,
      rentalCost: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      totalCost: 0,
      status: "active"
    });
    
    toast.success("Equipment added successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-blue-700">{formatCurrency(revenue)}</h3>
              </div>
              <span className="bg-blue-200 p-2 rounded-full text-blue-700">
                <CircleDollarSign size={20} />
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-blue-700">
                <span>Initial Budget:</span>
                <span className="font-semibold">{formatCurrency(budget)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-blue-700">
                <span>From Services:</span>
                <span className="font-semibold">{formatCurrency(revenue * 0.7)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-blue-700">
                <span>From Materials:</span>
                <span className="font-semibold">{formatCurrency(revenue * 0.3)}</span>
              </div>
              
              <div className="flex items-center justify-end gap-1 text-xs text-blue-700 mt-1">
                <ArrowUpRight size={12} />
                <span>+8.3% from estimate</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Expenses Card */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Total Expenses</p>
                <h3 className="text-2xl font-bold text-red-700">{formatCurrency(totalAllExpenses)}</h3>
              </div>
              <span className="bg-red-200 p-2 rounded-full text-red-700">
                <Minus size={20} />
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-red-700">
                <span>Contractors:</span>
                <span className="font-semibold">{formatCurrency(totalContractorCosts)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-red-700">
                <span>Materials:</span>
                <span className="font-semibold">{formatCurrency(totalMaterialCosts)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-red-700">
                <span>Equipment:</span>
                <span className="font-semibold">{formatCurrency(totalEquipmentCosts)}</span>
              </div>
              
              <div className="flex justify-between text-xs text-red-700">
                <span>Other Expenses:</span>
                <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
              </div>
              
              <div className="flex items-center justify-end gap-1 text-xs text-red-700 mt-1">
                <TrendingDown size={12} />
                <span>{budgetUsagePercentage}% of budget used</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profit Card */}
        <Card className={`bg-gradient-to-br ${isProfitable ? 'from-green-50 to-green-100 border-green-200' : 'from-amber-50 to-amber-100 border-amber-200'}`}>
          <CardContent className="pt-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className={`text-sm font-medium ${isProfitable ? 'text-green-700' : 'text-amber-700'} mb-1`}>Net Profit</p>
                <h3 className={`text-2xl font-bold ${isProfitable ? 'text-green-700' : 'text-amber-700'}`}>
                  {formatCurrency(netProfit)}
                </h3>
              </div>
              <span className={`p-2 rounded-full ${isProfitable ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-amber-700'}`}>
                {isProfitable ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className={`flex justify-between text-xs ${isProfitable ? 'text-green-700' : 'text-amber-700'}`}>
                <span>Budget Remaining:</span>
                <span className="font-semibold">{formatCurrency(budgetRemaining)}</span>
              </div>
              
              <div className={`flex justify-between text-xs ${isProfitable ? 'text-green-700' : 'text-amber-700'}`}>
                <span>Margin:</span>
                <span className="font-semibold">
                  {revenue > 0 ? `${Math.round((netProfit / revenue) * 100)}%` : '0%'}
                </span>
              </div>
              
              <div className={`flex justify-between text-xs ${isProfitable ? 'text-green-700' : 'text-amber-700'}`}>
                <span>Cost per completion %:</span>
                <span className="font-semibold">
                  {project.completion > 0 
                    ? formatCurrency(totalAllExpenses / (project.completion / 100))
                    : formatCurrency(0)}
                </span>
              </div>
              
              <div className={`flex items-center justify-end gap-1 text-xs ${isProfitable ? 'text-green-700' : 'text-amber-700'} mt-1`}>
                {isProfitable ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>
                  {isProfitable 
                    ? `${Math.round((netProfit / budget) * 100)}% profit on budget` 
                    : `${Math.round((Math.abs(netProfit) / budget) * 100)}% loss on budget`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeFinanceTab} onValueChange={setActiveFinanceTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expense distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(expensesCategories).length > 0 ? (
                    Object.entries(expensesCategories).map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="capitalize">{category}</span>
                        </div>
                        <div>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({totalAllExpenses > 0 ? Math.round((amount / totalAllExpenses) * 100) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No expense data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Status</CardTitle>
                <CardDescription>Current financial health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Budget Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${budgetUsagePercentage > 90 ? 'bg-red-500' : budgetUsagePercentage > 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{budgetUsagePercentage}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Project Completion</span>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{project.completion}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Expense Status</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                      Paid: {formatCurrency(expensesStatus?.paid || 0)}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      Pending: {formatCurrency(expensesStatus?.pending || 0)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Budget Efficiency</span>
                    <Badge 
                      variant="outline" 
                      className={`${
                        project.completion > budgetUsagePercentage 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {project.completion > budgetUsagePercentage ? 'Under Budget' : 'Over Budget'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Project is {project.completion}% complete with {budgetUsagePercentage}% of budget used
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Financial Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Display recent activity from all financial categories */}
                  {[
                    ...(projectWithFinanceData.expenses?.map(item => ({ ...item, type: 'expense' })) || []),
                    ...(projectWithFinanceData.contractors?.map(item => ({ ...item, type: 'contractor', name: `${item.name} (${item.role})`, amount: item.totalPaid, date: item.startDate })) || []),
                    ...(projectWithFinanceData.materials?.map(item => ({ ...item, type: 'material', amount: item.totalPrice, date: item.purchaseDate })) || []),
                    ...(projectWithFinanceData.equipment?.map(item => ({ ...item, type: 'equipment', amount: item.totalCost, date: item.startDate })) || [])
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {([
                    ...(projectWithFinanceData.expenses || []),
                    ...(projectWithFinanceData.contractors || []),
                    ...(projectWithFinanceData.materials || []),
                    ...(projectWithFinanceData.equipment || [])
                  ].length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        No financial activity recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Expenses</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Expense</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new expense.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="expense-name">Expense Name</Label>
                      <Input 
                        id="expense-name" 
                        value={newExpense.name}
                        onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expense-amount">Amount</Label>
                      <Input 
                        id="expense-amount" 
                        type="number"
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expense-date">Date</Label>
                        <Input 
                          id="expense-date" 
                          type="date"
                          value={newExpense.date}
                          onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="expense-category">Category</Label>
                        <Select 
                          value={newExpense.category}
                          onValueChange={value => setNewExpense({...newExpense, category: value})}
                        >
                          <SelectTrigger id="expense-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="labor">Labor</SelectItem>
                            <SelectItem value="materials">Materials</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="permits">Permits & Licenses</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="expense-status">Status</Label>
                      <Select 
                        value={newExpense.status}
                        onValueChange={value => setNewExpense({...newExpense, status: value as "paid" | "pending" | "cancelled"})}
                      >
                        <SelectTrigger id="expense-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="expense-description">Description (Optional)</Label>
                      <Textarea 
                        id="expense-description" 
                        value={newExpense.description || ""}
                        onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                        placeholder="Add details about this expense"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Expense</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectWithFinanceData.expenses && projectWithFinanceData.expenses.length > 0 ? (
                    projectWithFinanceData.expenses.map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{expense.name}</p>
                            {expense.description && (
                              <p className="text-xs text-muted-foreground">{expense.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              expense.status === "paid" ? "bg-green-100 text-green-800" :
                              expense.status === "pending" ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        No expenses recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contractors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Contractors</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Contractor</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contractor</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new contractor.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleContractorSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="contractor-name">Contractor Name</Label>
                      <Input 
                        id="contractor-name" 
                        value={newContractor.name}
                        onChange={e => setNewContractor({...newContractor, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contractor-role">Role</Label>
                      <Input 
                        id="contractor-role" 
                        value={newContractor.role}
                        onChange={e => setNewContractor({...newContractor, role: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractor-rate">Rate</Label>
                        <Input 
                          id="contractor-rate" 
                          type="number"
                          value={newContractor.rate}
                          onChange={e => setNewContractor({...newContractor, rate: parseFloat(e.target.value)})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contractor-rate-type">Rate Type</Label>
                        <Select 
                          value={newContractor.rateType}
                          onValueChange={value => setNewContractor({...newContractor, rateType: value as "hourly" | "fixed" | "daily"})}
                        >
                          <SelectTrigger id="contractor-rate-type">
                            <SelectValue placeholder="Select rate type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {newContractor.rateType !== "fixed" && (
                        <div>
                          <Label htmlFor="contractor-hours">Hours Worked</Label>
                          <Input 
                            id="contractor-hours" 
                            type="number"
                            value={newContractor.hoursWorked || 0}
                            onChange={e => setNewContractor({...newContractor, hoursWorked: parseFloat(e.target.value)})}
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="contractor-paid">Total Paid</Label>
                        <Input 
                          id="contractor-paid" 
                          type="number"
                          value={newContractor.totalPaid}
                          onChange={e => setNewContractor({...newContractor, totalPaid: parseFloat(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractor-start-date">Start Date</Label>
                        <Input 
                          id="contractor-start-date" 
                          type="date"
                          value={newContractor.startDate}
                          onChange={e => setNewContractor({...newContractor, startDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contractor-status">Status</Label>
                        <Select 
                          value={newContractor.status}
                          onValueChange={value => setNewContractor({...newContractor, status: value as "active" | "completed" | "terminated"})}
                        >
                          <SelectTrigger id="contractor-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contractor-contact">Contact Name (Optional)</Label>
                      <Input 
                        id="contractor-contact" 
                        value={newContractor.contact || ""}
                        onChange={e => setNewContractor({...newContractor, contact: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contractor-email">Email (Optional)</Label>
                        <Input 
                          id="contractor-email" 
                          type="email"
                          value={newContractor.email || ""}
                          onChange={e => setNewContractor({...newContractor, email: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contractor-phone">Phone (Optional)</Label>
                        <Input 
                          id="contractor-phone" 
                          value={newContractor.phone || ""}
                          onChange={e => setNewContractor({...newContractor, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Contractor</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectWithFinanceData.contractors && projectWithFinanceData.contractors.length > 0 ? (
                    projectWithFinanceData.contractors.map(contractor => (
                      <TableRow key={contractor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{contractor.name}</p>
                            {contractor.contact && (
                              <p className="text-xs text-muted-foreground">Contact: {contractor.contact}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{contractor.role}</TableCell>
                        <TableCell>
                          {formatCurrency(contractor.rate)} / {contractor.rateType}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              contractor.status === "active" ? "bg-green-100 text-green-800" :
                              contractor.status === "completed" ? "bg-blue-100 text-blue-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {contractor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(contractor.totalPaid)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        No contractors recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Materials</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Material</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new material.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleMaterialSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="material-name">Material Name</Label>
                      <Input 
                        id="material-name" 
                        value={newMaterial.name}
                        onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="material-quantity">Quantity</Label>
                        <Input 
                          id="material-quantity" 
                          type="number"
                          value={newMaterial.quantity}
                          onChange={e => setNewMaterial({...newMaterial, quantity: parseFloat(e.target.value)})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="material-unit-price">Unit Price</Label>
                        <Input 
                          id="material-unit-price" 
                          type="number"
                          value={newMaterial.unitPrice}
                          onChange={e => setNewMaterial({...newMaterial, unitPrice: parseFloat(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="material-date">Purchase Date</Label>
                        <Input 
                          id="material-date" 
                          type="date"
                          value={newMaterial.purchaseDate}
                          onChange={e => setNewMaterial({...newMaterial, purchaseDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="material-status">Status</Label>
                        <Select 
                          value={newMaterial.status}
                          onValueChange={value => setNewMaterial({...newMaterial, status: value as "ordered" | "delivered" | "used" | "returned"})}
                        >
                          <SelectTrigger id="material-status">
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
                      <div>
                        <Label htmlFor="material-supplier">Supplier (Optional)</Label>
                        <Input 
                          id="material-supplier" 
                          value={newMaterial.supplier || ""}
                          onChange={e => setNewMaterial({...newMaterial, supplier: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="material-category">Category</Label>
                        <Select 
                          value={newMaterial.category}
                          onValueChange={value => setNewMaterial({...newMaterial, category: value})}
                        >
                          <SelectTrigger id="material-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="lumber">Lumber</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="concrete">Concrete</SelectItem>
                            <SelectItem value="steel">Steel</SelectItem>
                            <SelectItem value="finishes">Finishes</SelectItem>
                            <SelectItem value="hvac">HVAC</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Material</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectWithFinanceData.materials && projectWithFinanceData.materials.length > 0 ? (
                    projectWithFinanceData.materials.map(material => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {material.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{material.quantity} @ {formatCurrency(material.unitPrice)}</TableCell>
                        <TableCell>{material.supplier || "—"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              material.status === "delivered" ? "bg-green-100 text-green-800" :
                              material.status === "ordered" ? "bg-amber-100 text-amber-800" :
                              material.status === "used" ? "bg-blue-100 text-blue-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {material.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(material.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        No materials recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="equipment" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Equipment</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Equipment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new equipment.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="equipment-name">Equipment Name</Label>
                      <Input 
                        id="equipment-name" 
                        value={newEquipment.name}
                        onChange={e => setNewEquipment({...newEquipment, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="equipment-type">Type</Label>
                      <Input 
                        id="equipment-type" 
                        value={newEquipment.type}
                        onChange={e => setNewEquipment({...newEquipment, type: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="equipment-is-rental" 
                        checked={newEquipment.isRental}
                        onCheckedChange={checked => setNewEquipment({...newEquipment, isRental: Boolean(checked)})}
                      />
                      <Label htmlFor="equipment-is-rental">This is a rental</Label>
                    </div>
                    
                    {newEquipment.isRental ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="equipment-rental-cost">Rental Cost</Label>
                          <Input 
                            id="equipment-rental-cost" 
                            type="number"
                            value={newEquipment.rentalCost || 0}
                            onChange={e => setNewEquipment({...newEquipment, rentalCost: parseFloat(e.target.value)})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="equipment-total-cost">Total Cost</Label>
                          <Input 
                            id="equipment-total-cost" 
                            type="number"
                            value={newEquipment.totalCost}
                            onChange={e => setNewEquipment({...newEquipment, totalCost: parseFloat(e.target.value)})}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="equipment-purchase-cost">Purchase Cost</Label>
                        <Input 
                          id="equipment-purchase-cost" 
                          type="number"
                          value={newEquipment.purchaseCost || 0}
                          onChange={e => setNewEquipment({
                            ...newEquipment, 
                            purchaseCost: parseFloat(e.target.value),
                            totalCost: parseFloat(e.target.value)
                          })}
                          required
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="equipment-start-date">Start Date</Label>
                        <Input 
                          id="equipment-start-date" 
                          type="date"
                          value={newEquipment.startDate}
                          onChange={e => setNewEquipment({...newEquipment, startDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      {newEquipment.isRental && (
                        <div>
                          <Label htmlFor="equipment-end-date">End Date (Optional)</Label>
                          <Input 
                            id="equipment-end-date" 
                            type="date"
                            value={newEquipment.endDate || ""}
                            onChange={e => setNewEquipment({...newEquipment, endDate: e.target.value})}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="equipment-status">Status</Label>
                      <Select 
                        value={newEquipment.status}
                        onValueChange={value => setNewEquipment({...newEquipment, status: value as "active" | "returned" | "owned"})}
                      >
                        <SelectTrigger id="equipment-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          {newEquipment.isRental && <SelectItem value="returned">Returned</SelectItem>}
                          {!newEquipment.isRental && <SelectItem value="owned">Owned</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Equipment</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectWithFinanceData.equipment && projectWithFinanceData.equipment.length > 0 ? (
                    projectWithFinanceData.equipment.map(equipment => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-medium">{equipment.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {equipment.type}
                            <Badge variant="outline" className={equipment.isRental ? "bg-blue-100" : "bg-green-100"}>
                              {equipment.isRental ? "Rental" : "Purchased"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              equipment.status === "active" ? "bg-green-100 text-green-800" :
                              equipment.status === "returned" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {equipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(equipment.startDate || "").toLocaleDateString()}
                          {equipment.endDate && (
                            <> to {new Date(equipment.endDate).toLocaleDateString()}</>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(equipment.totalCost)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        No equipment recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFinanceTab;
