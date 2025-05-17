
import { useState } from "react";
import { 
  Building, Briefcase, Printer, Package, Warehouse, 
  Coffee, FileText, Users, PenTool, Plus, Filter, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseCategory } from "@/types/finance";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type OfficeExpenseCategoriesProps = {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  categories: ExpenseCategory[];
  onAddCategory?: (category: ExpenseCategory) => void;
  onUpdateBudget?: (categoryId: string, budget: number) => void;
  selectedTimeFrame: "day" | "week" | "month" | "quarter" | "year" | "all";
  setSelectedTimeFrame: (timeFrame: "day" | "week" | "month" | "quarter" | "year" | "all") => void;
};

const OfficeExpenseCategories = ({ 
  activeCategory, 
  setActiveCategory,
  categories,
  onAddCategory,
  onUpdateBudget,
  selectedTimeFrame,
  setSelectedTimeFrame
}: OfficeExpenseCategoriesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3b82f6",
    iconType: "package"
  });
  const [newBudget, setNewBudget] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const icon = getIconByType(newCategory.iconType);
    
    const categoryToAdd: ExpenseCategory = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCategory.name,
      icon,
      color: newCategory.color,
      budget: 0,
      currentSpend: 0
    };

    if (onAddCategory) {
      onAddCategory(categoryToAdd);
    }

    setNewCategory({
      name: "",
      color: "#3b82f6",
      iconType: "package"
    });

    setIsAddDialogOpen(false);
    toast.success("Category added successfully");
  };

  const handleUpdateBudget = () => {
    if (!selectedCategoryForBudget) {
      toast.error("No category selected");
      return;
    }

    const budget = parseFloat(newBudget);
    if (isNaN(budget) || budget < 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    if (onUpdateBudget) {
      onUpdateBudget(selectedCategoryForBudget, budget);
    }

    setIsBudgetDialogOpen(false);
    setSelectedCategoryForBudget(null);
    setNewBudget("");
    toast.success("Budget updated successfully");
  };

  const getBudgetStatus = (category: ExpenseCategory) => {
    if (!category.budget || category.budget === 0) return "none";
    
    const percentage = ((category.currentSpend || 0) / category.budget) * 100;
    if (percentage > 90) return "danger";
    if (percentage > 70) return "warning";
    return "good";
  };

  const getIconByType = (iconType: string) => {
    switch (iconType) {
      case "building": return <Building className="h-4 w-4" />;
      case "briefcase": return <Briefcase className="h-4 w-4" />;
      case "printer": return <Printer className="h-4 w-4" />;
      case "package": return <Package className="h-4 w-4" />;
      case "warehouse": return <Warehouse className="h-4 w-4" />;
      case "coffee": return <Coffee className="h-4 w-4" />;
      case "file": return <FileText className="h-4 w-4" />;
      case "users": return <Users className="h-4 w-4" />;
      case "pen": return <PenTool className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Expense Categories</h3>
        
        <div className="flex gap-2">
          <Select value={selectedTimeFrame} onValueChange={(value: any) => setSelectedTimeFrame(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          {onAddCategory && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="rounded-full"
        >
          All Categories
        </Button>
        
        {categories.map((category) => {
          const budgetStatus = getBudgetStatus(category);
          return (
            <div key={category.id} className="relative">
              <Button
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full ${activeCategory === category.id ? "" : `bg-${category.color.replace('#', '')}-100`}`}
              >
                {category.icon}
                <span className="mx-1">{category.name}</span>
                
                {category.budget && category.budget > 0 && (
                  <Badge 
                    className={`ml-1 ${
                      budgetStatus === "danger" ? "bg-red-500" :
                      budgetStatus === "warning" ? "bg-amber-500" :
                      "bg-green-500"
                    }`}
                    variant="secondary"
                  >
                    ${((category.currentSpend || 0) / 1000).toFixed(1)}k/${(category.budget / 1000).toFixed(1)}k
                  </Badge>
                )}
              </Button>
              
              {onUpdateBudget && category.budget !== undefined && (
                <div 
                  className="absolute -top-2 -right-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategoryForBudget(category.id);
                    setNewBudget(category.budget?.toString() || "");
                    setIsBudgetDialogOpen(true);
                  }}
                >
                  <ShieldCheck 
                    className={`h-4 w-4 ${
                      budgetStatus === "danger" ? "text-red-500" :
                      budgetStatus === "warning" ? "text-amber-500" :
                      budgetStatus === "good" ? "text-green-500" :
                      "text-gray-400"
                    }`} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                value={newCategory.name} 
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} 
                placeholder="e.g., Office Supplies" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select 
                value={newCategory.iconType}
                onValueChange={(value) => setNewCategory({...newCategory, iconType: value})}
              >
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building">Building</SelectItem>
                  <SelectItem value="briefcase">Briefcase</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="pen">Pen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="color" 
                  type="color" 
                  value={newCategory.color} 
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})} 
                  className="w-12 h-8 p-1" 
                />
                <div className="w-full h-8 rounded border" style={{ backgroundColor: newCategory.color }} />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget Amount</Label>
              <Input 
                id="budget" 
                type="number" 
                value={newBudget} 
                onChange={(e) => setNewBudget(e.target.value)} 
                placeholder="e.g., 5000" 
              />
              <p className="text-sm text-muted-foreground">Set the budget for this category</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateBudget}>Update Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeExpenseCategories;
