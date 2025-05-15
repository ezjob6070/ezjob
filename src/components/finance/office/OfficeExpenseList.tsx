import { useState } from "react";
import { DateRange } from "react-day-picker";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MoreVertical, Edit, Trash2, Search, Plus, Receipt, Calendar, FileImage } from "lucide-react";
import { OfficeExpense } from "@/types/finance";

type OfficeExpenseListProps = {
  date: DateRange | undefined;
  activeCategory: string | null;
  expenses: OfficeExpense[];
  onAddExpense?: (expense: OfficeExpense) => void;
  onEditExpense?: (expense: OfficeExpense) => void;
  onDeleteExpense?: (expenseId: string) => void;
};

const OfficeExpenseList = ({ 
  date, 
  activeCategory, 
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense
}: OfficeExpenseListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<OfficeExpense | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Update the type to include recurring and receipt fields
  const [newExpense, setNewExpense] = useState<Partial<OfficeExpense>>({
    date: new Date().toISOString().split('T')[0],
    category: activeCategory || "",
    description: "",
    amount: 0,
    paymentMethod: "credit",
    vendor: "",
    status: "paid",
    recurring: false,
    receipt: ""
  });
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !activeCategory || expense.category === activeCategory;
    const matchesSearch = !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  const handleAddEditExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      return; // Todo: Add validation feedback
    }

    const expenseData = {
      id: selectedExpense?.id || `expense-${Date.now()}`,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      category: newExpense.category || "",
      description: newExpense.description || "",
      amount: Number(newExpense.amount),
      paymentMethod: newExpense.paymentMethod || "credit",
      vendor: newExpense.vendor || "",
      status: newExpense.status || "paid" as "paid" | "pending" | "overdue",
      recurring: newExpense.recurring,
      receipt: newExpense.receipt
    } as OfficeExpense;

    if (selectedExpense) {
      onEditExpense && onEditExpense(expenseData);
    } else {
      onAddExpense && onAddExpense(expenseData);
    }

    setIsAddEditDialogOpen(false);
    setSelectedExpense(null);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: activeCategory || "",
      description: "",
      amount: 0,
      paymentMethod: "credit",
      vendor: "",
      status: "paid",
      recurring: false,
      receipt: ""
    });
  };

  const handleDeleteExpense = () => {
    if (selectedExpense && onDeleteExpense) {
      onDeleteExpense(selectedExpense.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleViewExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setIsViewDialogOpen(true);
  };

  const handleEditExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setNewExpense({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod || "credit",
      vendor: expense.vendor || "",
      status: expense.status || "paid",
      recurring: expense.recurring || false
    });
    setIsAddEditDialogOpen(true);
  };

  const confirmDeleteExpense = (expense: OfficeExpense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryName = (categoryId: string): string => {
    const categories: { [key: string]: string } = {
      "rent": "Rent",
      "secretary": "Secretary",
      "equipment": "Equipment",
      "inventory": "Inventory",
      "warehouse": "Warehouse",
      "utilities": "Utilities",
      "insurance": "Insurance",
      "staff": "Staff",
      "other": "Other"
    };
    return categories[categoryId] || categoryId;
  };

  const getCategoryColor = (categoryId: string): string => {
    const colors: { [key: string]: string } = {
      "rent": "blue",
      "secretary": "pink",
      "equipment": "amber",
      "inventory": "emerald",
      "warehouse": "indigo",
      "utilities": "red",
      "insurance": "purple",
      "staff": "cyan",
      "other": "gray"
    };
    return colors[categoryId] || "gray";
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch(status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return null;
    }
  };

  const handleAddNew = () => {
    setSelectedExpense(null);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: activeCategory || "",
      description: "",
      amount: 0,
      paymentMethod: "credit",
      vendor: "",
      status: "paid",
      recurring: false,
      receipt: ""
    });
    setIsAddEditDialogOpen(true);
  };

  // Fix Input type to handle Date objects for 'date' field
  const renderDateInput = () => (
    <div className="flex">
      <Calendar className="h-4 w-4 absolute mt-3 ml-3 text-muted-foreground" />
      <Input
        id="date"
        type="date"
        value={typeof newExpense.date === 'string' ? newExpense.date : newExpense.date?.toISOString().split('T')[0] || ''}
        onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
        className="pl-10"
      />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-xl font-bold">Expense Transactions</h3>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {onAddExpense && (
            <Button onClick={handleAddNew} variant="default">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {(onEditExpense || onDeleteExpense) && <TableHead></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={(onEditExpense || onDeleteExpense) ? 7 : 6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No matching expenses found." : "No expenses found for the selected category."}
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewExpense(expense)}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`bg-${getCategoryColor(expense.category)}-100`}>
                      {getCategoryName(expense.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.vendor || "-"}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="text-right font-medium">${expense.amount.toLocaleString()}</TableCell>
                  {(onEditExpense || onDeleteExpense) && (
                    <TableCell className="text-right p-0 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewExpense(expense);
                          }}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {onEditExpense && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditExpense(expense);
                            }}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {onDeleteExpense && (
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteExpense(expense);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Expense Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{new Date(selectedExpense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                  <p className="font-semibold">${selectedExpense.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <Badge variant="outline" className={`bg-${getCategoryColor(selectedExpense.category)}-100`}>
                  {getCategoryName(selectedExpense.category)}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p>{selectedExpense.description}</p>
              </div>
              
              {selectedExpense.vendor && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Vendor</h4>
                  <p>{selectedExpense.vendor}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <p>{selectedExpense.paymentMethod || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  {getStatusBadge(selectedExpense.status)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Recurring</h4>
                <p>{selectedExpense.recurring ? "Yes" : "No"}</p>
              </div>
              
              {selectedExpense.receipt && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Receipt</h4>
                  <Button variant="outline" size="sm" className="mt-1">
                    <FileImage className="h-4 w-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {onEditExpense && selectedExpense && (
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleEditExpense(selectedExpense);
              }}>Edit</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
            <DialogDescription>
              {selectedExpense 
                ? "Update the details of this expense." 
                : "Enter the details for the new expense."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                {renderDateInput()}
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Category</option>
                <option value="rent">Rent</option>
                <option value="secretary">Secretary</option>
                <option value="equipment">Equipment</option>
                <option value="inventory">Inventory</option>
                <option value="warehouse">Warehouse</option>
                <option value="utilities">Utilities</option>
                <option value="insurance">Insurance</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="credit">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newExpense.status}
                  onChange={(e) => setNewExpense({...newExpense, status: e.target.value as any})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 mt-8">
                <Checkbox 
                  id="recurring"
                  checked={newExpense.recurring} 
                  onCheckedChange={(checked) => setNewExpense({...newExpense, recurring: !!checked})}
                />
                <Label htmlFor="recurring" className="cursor-pointer">Recurring Expense</Label>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="receipt">Receipt</Label>
              <Input id="receipt" type="file" />
              <p className="text-xs text-muted-foreground">Upload a receipt image (optional)</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEditExpense}>
              {selectedExpense ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpense && (
            <div className="py-4">
              <p><strong>Description:</strong> {selectedExpense.description}</p>
              <p><strong>Amount:</strong> ${selectedExpense.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> {new Date(selectedExpense.date).toLocaleDateString()}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteExpense}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeExpenseList;
