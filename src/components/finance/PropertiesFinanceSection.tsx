
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useState } from "react";

interface PropertiesFinanceSectionProps {
  date?: DateRange;
}

const PropertiesFinanceSection = ({ date }: PropertiesFinanceSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for property financials
  const propertiesData = [
    {
      address: "123 Luxury Lane",
      type: "Residential",
      status: "Active",
      listPrice: 850000,
      expenses: 12500,
      projectedProfit: 42500,
      roi: "15.2%",
      annualRevenue: 96000,
      occupancyRate: "94%"
    },
    {
      address: "456 Commerce Ave",
      type: "Commercial",
      status: "Under Contract",
      listPrice: 1250000,
      expenses: 18750,
      projectedProfit: 62500,
      roi: "18.5%",
      annualRevenue: 180000,
      occupancyRate: "100%"
    },
    {
      address: "789 Coastal Drive",
      type: "Residential",
      status: "Active",
      listPrice: 675000,
      expenses: 10125,
      projectedProfit: 33750,
      roi: "13.8%",
      annualRevenue: 72000,
      occupancyRate: "92%"
    }
  ];

  const filteredProperties = propertiesData.filter(property =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Property Financial Analytics</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Property Value</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(2775000)}</div>
            <div className="text-sm text-blue-600 mt-2">48 active listings</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Annual Revenue</div>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(348000)}</div>
            <div className="text-sm text-emerald-600 mt-2">+8.5% YoY</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Avg. ROI</div>
            <div className="text-2xl font-bold text-violet-700">15.8%</div>
            <div className="text-sm text-violet-600 mt-2">+2.3% from last year</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Occupancy Rate</div>
            <div className="text-2xl font-bold text-amber-700">95.3%</div>
            <div className="text-sm text-amber-600 mt-2">+1.2% from last month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Financial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">List Price</TableHead>
                <TableHead className="text-right">Annual Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Occupancy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.address}>
                  <TableCell className="font-medium">{property.address}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell className="text-right">{formatCurrency(property.listPrice)}</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(property.annualRevenue)}</TableCell>
                  <TableCell className="text-right text-red-600">-{formatCurrency(property.expenses)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{property.roi}</TableCell>
                  <TableCell className="text-right">{property.occupancyRate}</TableCell>
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
