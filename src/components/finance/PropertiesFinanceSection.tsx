
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface PropertiesFinanceSectionProps {
  date?: DateRange;
}

const PropertiesFinanceSection = ({ date }: PropertiesFinanceSectionProps) => {
  // Sample data for property financials
  const propertiesData = [
    {
      address: "123 Luxury Lane",
      type: "Residential",
      status: "Active",
      listPrice: 850000,
      expenses: 12500,
      projectedProfit: 42500
    },
    {
      address: "456 Commerce Ave",
      type: "Commercial",
      status: "Under Contract",
      listPrice: 1250000,
      expenses: 18750,
      projectedProfit: 62500
    },
    {
      address: "789 Coastal Drive",
      type: "Residential",
      status: "Active",
      listPrice: 675000,
      expenses: 10125,
      projectedProfit: 33750
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Property Value</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(2775000)}</div>
            <div className="text-sm text-blue-600 mt-2">48 active listings</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Avg. Days on Market</div>
            <div className="text-2xl font-bold text-amber-700">32</div>
            <div className="text-sm text-amber-600 mt-2">-5 days from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Projected Revenue</div>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(138750)}</div>
            <div className="text-sm text-emerald-600 mt-2">From current listings</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">List Price</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Projected Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertiesData.map((property) => (
                <TableRow key={property.address}>
                  <TableCell className="font-medium">{property.address}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell className="text-right">{formatCurrency(property.listPrice)}</TableCell>
                  <TableCell className="text-right text-red-600">-{formatCurrency(property.expenses)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(property.projectedProfit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesFinanceSection;
