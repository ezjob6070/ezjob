import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus, Edit, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Expense } from '@/types/finance';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Expense name must be at least 2 characters.",
  }),
  amount: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Amount must be a valid number greater than zero.",
  }),
  date: z.date(),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  description: z.string().optional(),
  receipt: z.string().optional(),
  paymentMethod: z.string().min(2, {
    message: "Payment method must be at least 2 characters.",
  }),
  status: z.string().min(2, {
    message: "Status must be at least 2 characters.",
  }),
})

interface OfficeExpenseListProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const OfficeExpenseList: React.FC<OfficeExpenseListProps> = ({ expenses, setExpenses }) => {
  const [open, setOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "",
      date: date || new Date(),
      category: "",
      description: "",
      receipt: "",
      paymentMethod: "",
      status: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedExpense?.name || "",
      amount: selectedExpense?.amount?.toString() || "",
      date: selectedExpense?.date ? new Date(selectedExpense.date) : new Date(),
      category: selectedExpense?.category || "",
      description: selectedExpense?.description || "",
      receipt: selectedExpense?.receipt || "",
      paymentMethod: selectedExpense?.paymentMethod || "",
      status: selectedExpense?.status || "",
    },
  });

  useEffect(() => {
    if (selectedExpense) {
      editForm.reset({
        name: selectedExpense.name || "",
        amount: selectedExpense.amount?.toString() || "",
        date: selectedExpense.date ? new Date(selectedExpense.date) : new Date(),
        category: selectedExpense.category || "",
        description: selectedExpense.description || "",
        receipt: selectedExpense.receipt || "",
        paymentMethod: selectedExpense.paymentMethod || "",
        status: selectedExpense.status || "",
      });
    }
  }, [selectedExpense, editForm]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      ...values,
      amount: parseFloat(values.amount),
      date: values.date.toISOString().split('T')[0],
    };

    setExpenses([...expenses, newExpense]);
    toast.success("Expense created successfully!");
    form.reset();
    setOpen(false);
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  const handleUpdateExpense = (values: z.infer<typeof formSchema>) => {
    if (!selectedExpense) return;

    const updatedExpense: Expense = {
      ...selectedExpense,
      ...values,
      amount: parseFloat(values.amount),
      date: values.date.toISOString().split('T')[0],
    };

    const updatedExpenses = expenses.map(exp =>
      exp.id === selectedExpense.id ? updatedExpense : exp
    );

    setExpenses(updatedExpenses);
    toast.success("Expense updated successfully!");
    setEditOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
    toast.success("Expense deleted successfully!");
  };

  const handleDateChange = (date: string | number | readonly string[]) => {
    if (date instanceof Date) {
      form.setValue("date", date);
    }
  };

  return (
    <div>
      <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-lg font-semibold">Office Expenses</h3>
          <p className="text-sm text-muted-foreground">Manage and track office-related expenses.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-blue-500 text-white hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
              <TableCell>${expense.amount}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.paymentMethod}</TableCell>
              <TableCell>{expense.status}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEditExpense(expense)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Create a new office expense to track your finances.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter expense name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter amount" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receipt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter receipt URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment method" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Add Expense</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Edit the details of the selected office expense.
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdateExpense)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter expense name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                editForm.setValue("date", date);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter receipt URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter payment method" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter status" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Update Expense</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficeExpenseList;
