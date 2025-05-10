
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OfficeExpense } from "@/types/finance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";

interface OfficeExpenseListProps {
  expenses: OfficeExpense[];
  onAddExpense: (expense: OfficeExpense) => void;
  onEditExpense: (updatedExpense: OfficeExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
  date?: DateRange;
  activeCategory?: string;
}

const expenseSchema = z.object({
  date: z.string().min(1, {
    message: "Date is required",
  }),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  paymentMethod: z.string().optional(),
  recurring: z.boolean().default(false),
  frequency: z.string().optional(),
});

const OfficeExpenseList: React.FC<OfficeExpenseListProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  date,
  activeCategory
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<OfficeExpense | null>(
    null
  );

  const filteredExpenses = expenses.filter((expense) => {
    const searchTerm = search.toLowerCase();
    // Filter by search term
    const matchesSearch = expense.category.toLowerCase().includes(searchTerm) ||
      (expense.description?.toLowerCase().includes(searchTerm) || false) ||
      expense.amount.toString().includes(searchTerm) ||
      (typeof expense.date === 'string' && expense.date.includes(searchTerm));

    // Filter by category if activeCategory is provided
    const matchesCategory = !activeCategory || activeCategory === 'all' || 
      expense.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: "",
      amount: "",
      category: "",
      description: "",
      paymentMethod: "",
      recurring: false,
      frequency: "",
    },
  });

  const editExpenseForm = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: "",
      amount: "",
      category: "",
      description: "",
      paymentMethod: "",
      recurring: false,
      frequency: "",
    },
  });

  useEffect(() => {
    if (selectedExpense) {
      editExpenseForm.setValue("date", typeof selectedExpense.date === 'string' ? selectedExpense.date : format(selectedExpense.date, 'yyyy-MM-dd'));
      editExpenseForm.setValue("amount", selectedExpense.amount.toString());
      editExpenseForm.setValue("category", selectedExpense.category);
      editExpenseForm.setValue("description", selectedExpense.description || '');
      editExpenseForm.setValue("paymentMethod", selectedExpense.paymentMethod || "");
      editExpenseForm.setValue("recurring", selectedExpense.recurring || false);
      editExpenseForm.setValue("frequency", selectedExpense.frequency || "");
    }
  }, [selectedExpense, editExpenseForm]);

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    try {
      await onAddExpense({
        id: Math.random().toString(36).substring(7),
        date: values.date,
        amount: parseFloat(values.amount),
        category: values.category,
        description: values.description,
        paymentMethod: values.paymentMethod,
        recurring: values.recurring,
        frequency: values.frequency as 'monthly' | 'quarterly' | 'yearly' | undefined
      });
      toast({
        title: "Success",
        description: "Office expense added successfully",
      });
      expenseForm.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onEditSubmit = async (values: z.infer<typeof expenseSchema>) => {
    try {
      if (selectedExpense) {
        await onEditExpense({
          id: selectedExpense.id,
          date: values.date,
          amount: parseFloat(values.amount),
          category: values.category,
          description: values.description,
          paymentMethod: values.paymentMethod,
          recurring: values.recurring,
          frequency: values.frequency as 'monthly' | 'quarterly' | 'yearly' | undefined
        });
        toast({
          title: "Success",
          description: "Office expense updated successfully",
        });
        editExpenseForm.reset();
        setEditOpen(false);
        setSelectedExpense(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const formatDateValue = (value: string | Date): string => {
    if (!value) return '';
    if (typeof value === 'string') {
      return value;
    }
    return format(value, 'yyyy-MM-dd');
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Office Expenses</CardTitle>
          <CardDescription>Manage your office expenses here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Office Expense</DialogTitle>
                  <DialogDescription>
                    Add a new office expense to the list.
                  </DialogDescription>
                </DialogHeader>
                <Form {...expenseForm}>
                  <form onSubmit={expenseForm.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={expenseForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="Date"
                                {...field}
                                value={formatDateValue(field.value)}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amount"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Rent">Rent</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                                <SelectItem value="Supplies">Supplies</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Description"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Debit Card">Debit Card</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="recurring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Recurring</FormLabel>
                              <FormDescription>Is this a recurring expense?</FormDescription>
                            </div>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {expenseForm.getValues("recurring") && (
                        <FormField
                          control={expenseForm.control}
                          name="frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Monthly">Monthly</SelectItem>
                                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                                  <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <Button type="submit">Add Expense</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Recurring</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right">{expense.amount}</TableCell>
                      <TableCell className="text-center">
                        {expense.recurring ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedExpense(expense);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Trash className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently
                                      delete the expense from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        deleteOfficeExpense(expense.id);
                                        toast({
                                          title: "Success",
                                          description: "Office expense deleted successfully",
                                        });
                                      }}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Office Expense</DialogTitle>
            <DialogDescription>Edit the selected office expense.</DialogDescription>
          </DialogHeader>
          <Form {...editExpenseForm}>
            <form onSubmit={editExpenseForm.handleSubmit(onEditSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={editExpenseForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Date"
                          {...field}
                          value={formatDateValue(field.value)}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editExpenseForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editExpenseForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Supplies">Supplies</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Software">Software</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editExpenseForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editExpenseForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editExpenseForm.control}
                  name="recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recurring</FormLabel>
                        <FormDescription>Is this a recurring expense?</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {editExpenseForm.getValues("recurring") && (
                  <FormField
                    control={editExpenseForm.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <Button type="submit">Edit Expense</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeExpenseList;
