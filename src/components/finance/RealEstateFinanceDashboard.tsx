
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileChartPie, Building, Banknote, ChartBar } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { DonutChart } from "@/components/DonutChart";

interface RealEstateFinanceDashboardProps {
  date?: DateRange;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
}

const RealEstateFinanceDashboard = ({
  date,
  totalRevenue,
  totalExpenses,
  totalProfit
}: RealEstateFinanceDashboardProps) => {
  // Sample data for property type breakdown
  const propertyTypeData = [
    { name: "Residential", value: 65, color: "#4f46e5" },
    { name: "Commercial", value: 20, color: "#0ea5e9" },
    { name: "Land", value: 15, color: "#10b981" }
  ];

  // Sample data for revenue sources
  const revenueSourceData = [
    { name: "Sales", value: 45, color: "#8b5cf6" },
    { name: "Rentals", value: 30, color: "#ec4899" },
    { name: "Property Mgmt", value: 25, color: "#f59e0b" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Building className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                +12% YoY
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Properties</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">248</p>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Banknote className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                +8.3% MTD
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Current period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <FileChartPie className="h-5 w-5 text-violet-600" />
              <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                +15% QoQ
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Profit Margin</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {((totalProfit / totalRevenue) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ChartBar className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                +5.2% MTD
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Avg. Property Value</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(850000)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Portfolio average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart 
              data={propertyTypeData}
              title="248"
              subtitle="Properties"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart 
              data={revenueSourceData}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Revenue"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealEstateFinanceDashboard;
