
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ExpenseTrend = {
  name: string;
  Rent?: number;
  Secretary?: number;
  Equipment?: number;
  Inventory?: number;
  Warehouse?: number;
  Utilities?: number;
  Insurance?: number;
  Staff?: number;
  Other?: number;
  Total: number;
};

type OfficeExpenseTrendsProps = {
  date: DateRange | undefined;
  activeCategory: string | null;
};

const OfficeExpenseTrends = ({ date, activeCategory }: OfficeExpenseTrendsProps) => {
  const [viewType, setViewType] = useState<"monthly" | "category">("monthly");
  
  // This would normally come from your data hooks
  const monthlyData: ExpenseTrend[] = [
    { name: "Jan", Rent: 2850, Equipment: 250, Secretary: 1800, Utilities: 320, Inventory: 200, Total: 5420 },
    { name: "Feb", Rent: 2850, Equipment: 450, Secretary: 1800, Utilities: 300, Inventory: 150, Total: 5550 },
    { name: "Mar", Rent: 2850, Equipment: 200, Secretary: 1800, Utilities: 310, Inventory: 350, Total: 5510 },
    { name: "Apr", Rent: 2850, Equipment: 600, Secretary: 1800, Utilities: 330, Inventory: 180, Total: 5760 },
    { name: "May", Rent: 2850, Equipment: 300, Secretary: 1900, Utilities: 340, Inventory: 220, Total: 5610 },
    { name: "Jun", Rent: 2900, Equipment: 200, Secretary: 1900, Utilities: 350, Inventory: 240, Total: 5590 },
  ];
  
  const categoryData: ExpenseTrend[] = [
    { name: "Rent", Total: 17150 },
    { name: "Secretary", Total: 11000 },
    { name: "Equipment", Total: 2000 },
    { name: "Utilities", Total: 1950 },
    { name: "Inventory", Total: 1340 },
    { name: "Warehouse", Total: 3600 },
    { name: "Insurance", Total: 2250 },
    { name: "Staff", Total: 2550 },
    { name: "Other", Total: 850 },
  ];

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      "Rent": "#3b82f6", // blue
      "Secretary": "#ec4899", // pink
      "Equipment": "#f59e0b", // amber
      "Inventory": "#10b981", // emerald
      "Warehouse": "#6366f1", // indigo
      "Utilities": "#ef4444", // red
      "Insurance": "#a855f7", // purple
      "Staff": "#06b6d4", // cyan
      "Other": "#6b7280", // gray
      "Total": "#000000" // black
    };
    return colors[category] || "#6b7280";
  };

  const displayData = viewType === "monthly" ? monthlyData : categoryData;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Expense Trends</h3>
        <RadioGroup
          defaultValue="monthly"
          className="flex space-x-4"
          onValueChange={(value) => setViewType(value as "monthly" | "category")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="category" id="category" />
            <Label htmlFor="category">By Category</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            
            {viewType === "monthly" ? (
              // For monthly view, show stacked bars by category
              <>
                <Bar dataKey="Rent" stackId="a" fill={getCategoryColor("Rent")} />
                <Bar dataKey="Secretary" stackId="a" fill={getCategoryColor("Secretary")} />
                <Bar dataKey="Equipment" stackId="a" fill={getCategoryColor("Equipment")} />
                <Bar dataKey="Inventory" stackId="a" fill={getCategoryColor("Inventory")} />
                <Bar dataKey="Utilities" stackId="a" fill={getCategoryColor("Utilities")} />
              </>
            ) : (
              // For category view, show single bars by category
              <Bar dataKey="Total" fill="#6366f1" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OfficeExpenseTrends;
