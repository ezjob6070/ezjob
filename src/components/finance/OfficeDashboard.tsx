
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import OfficeExpensesOverview from "@/components/finance/office/OfficeExpensesOverview";
import OfficeExpenseCategories from "@/components/finance/office/OfficeExpenseCategories";
import OfficeExpenseList from "@/components/finance/office/OfficeExpenseList";
import OfficeExpenseTrends from "@/components/finance/office/OfficeExpenseTrends";

type OfficeDashboardProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const OfficeDashboard = ({ date, setDate }: OfficeDashboardProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="space-y-8 mt-6">
      <h2 className="text-3xl font-bold">Office & Other Expenses</h2>
      
      {/* Overview Cards */}
      <OfficeExpensesOverview date={date} activeCategory={activeCategory} />
      
      {/* Categories Section */}
      <OfficeExpenseCategories 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Expense List */}
        <Card>
          <CardContent className="pt-6">
            <OfficeExpenseList date={date} activeCategory={activeCategory} />
          </CardContent>
        </Card>
        
        {/* Expense Trends */}
        <Card>
          <CardContent className="pt-6">
            <OfficeExpenseTrends date={date} activeCategory={activeCategory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficeDashboard;
