
import { DateRange } from "react-day-picker";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
};

type OfficeExpenseListProps = {
  date: DateRange | undefined;
  activeCategory: string | null;
};

const OfficeExpenseList = ({ date, activeCategory }: OfficeExpenseListProps) => {
  // This would normally come from your data hooks
  const expenses: Expense[] = [
    { id: "1", date: "2023-10-01", category: "rent", description: "Office Rent - October", amount: 2850 },
    { id: "2", date: "2023-10-05", category: "equipment", description: "New Printer", amount: 549.99 },
    { id: "3", date: "2023-10-08", category: "secretary", description: "Secretary Salary", amount: 1800 },
    { id: "4", date: "2023-10-10", category: "utilities", description: "Electricity Bill", amount: 320.50 },
    { id: "5", date: "2023-10-15", category: "inventory", description: "Office Supplies", amount: 420.50 },
    { id: "6", date: "2023-10-20", category: "insurance", description: "Business Insurance", amount: 750 },
    { id: "7", date: "2023-10-25", category: "warehouse", description: "Warehouse Rent", amount: 1200 },
    { id: "8", date: "2023-10-28", category: "staff", description: "Staff Training", amount: 850 },
  ];

  const filteredExpenses = activeCategory 
    ? expenses.filter(expense => expense.category === activeCategory)
    : expenses;

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

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Recent Expenses</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`bg-${getCategoryColor(expense.category)}-100`}>
                  {getCategoryName(expense.category)}
                </Badge>
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right font-medium">${expense.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfficeExpenseList;
