
import { 
  Building, Briefcase, Printer, Package, Warehouse, 
  Coffee, FileText, Users, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

type OfficeExpenseCategoriesProps = {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
};

const OfficeExpenseCategories = ({ 
  activeCategory, 
  setActiveCategory 
}: OfficeExpenseCategoriesProps) => {
  const categories: Category[] = [
    { id: "rent", name: "Rent", icon: <Building className="h-4 w-4" />, color: "bg-blue-100" },
    { id: "secretary", name: "Secretary", icon: <Briefcase className="h-4 w-4" />, color: "bg-pink-100" },
    { id: "equipment", name: "Equipment", icon: <Printer className="h-4 w-4" />, color: "bg-amber-100" },
    { id: "inventory", name: "Inventory", icon: <Package className="h-4 w-4" />, color: "bg-emerald-100" },
    { id: "warehouse", name: "Warehouse", icon: <Warehouse className="h-4 w-4" />, color: "bg-indigo-100" },
    { id: "utilities", name: "Utilities", icon: <Coffee className="h-4 w-4" />, color: "bg-red-100" },
    { id: "insurance", name: "Insurance", icon: <FileText className="h-4 w-4" />, color: "bg-purple-100" },
    { id: "staff", name: "Staff", icon: <Users className="h-4 w-4" />, color: "bg-cyan-100" },
    { id: "other", name: "Other", icon: <PenTool className="h-4 w-4" />, color: "bg-gray-100" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Expense Categories</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="rounded-full"
        >
          All Categories
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-full ${activeCategory === category.id ? "" : category.color}`}
          >
            {category.icon}
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OfficeExpenseCategories;
