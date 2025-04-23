
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import DateRangeFilter from "./technician-filters/DateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InvoiceButton from "./InvoiceButton";

interface PropertiesFinanceSectionProps {
  date?: DateRange;
}

const PropertiesFinanceSection = ({ date: initialDate }: PropertiesFinanceSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(initialDate);
  const [sortBy, setSortBy] = useState<"revenue" | "expenses" | "profit" | "roi">("revenue");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "under-contract" | "sold">("all");

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
      occupancyRate: "94%",
      ownerName: "John Smith",
      ownerPhone: "555-0123",
      zipCode: "90210"
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
      occupancyRate: "100%",
      ownerName: "Sarah Johnson",
      ownerPhone: "555-0124",
      zipCode: "90211"
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
      occupancyRate: "92%",
      ownerName: "Mike Wilson",
      ownerPhone: "555-0125",
      zipCode: "90212"
    }
  ];

  const filteredProperties = propertiesData
    .filter(property => 
      (statusFilter === "all" || property.status.toLowerCase().replace(" ", "-") === statusFilter) &&
      (
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.zipCode.includes(searchQuery) ||
        property.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.ownerPhone.includes(searchQuery)
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "revenue":
          return b.annualRevenue - a.annualRevenue;
        case "expenses":
          return b.expenses - a.expenses;
        case "profit":
          return b.projectedProfit - a.projectedProfit;
        case "roi":
          return parseFloat(b.roi) - parseFloat(a.roi);
        default:
          return 0;
      }
    });

  const totalValue = propertiesData.reduce((sum, property) => sum + property.listPrice, 0);
  const totalRevenue = propertiesData.reduce((sum, property) => sum + property.annualRevenue, 0);
  const totalExpenses = propertiesData.reduce((sum, property) => sum + property.expenses, 0);
  const avgRoi = (propertiesData.reduce((sum, property) => sum + parseFloat(property.roi), 0) / propertiesData.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Property Financial Analytics</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, zip, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DateRangeFilter date={date} setDate={setDate} />
          
          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "under-contract" | "sold") => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under-contract">Under Contract</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: "revenue" | "expenses" | "profit" | "roi") => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Sort by Revenue</SelectItem>
              <SelectItem value="expenses">Sort by Expenses</SelectItem>
              <SelectItem value="profit">Sort by Profit</SelectItem>
              <SelectItem value="roi">Sort by ROI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Property Value</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-blue-600 mt-2">{propertiesData.length} properties</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Annual Revenue</div>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-emerald-600 mt-2">+8.5% YoY</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Expenses</div>
            <div className="text-2xl font-bold text-red-700">-{formatCurrency(totalExpenses)}</div>
            <div className="text-sm text-red-600 mt-2">-2.3% from last year</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Average ROI</div>
            <div className="text-2xl font-bold text-amber-700">{avgRoi}%</div>
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
                <TableHead>Property Details</TableHead>
                <TableHead>Owner Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">List Price</TableHead>
                <TableHead className="text-right">Annual Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.address}>
                  <TableCell>
                    <div className="font-medium">{property.address}</div>
                    <div className="text-sm text-muted-foreground">{property.zipCode}</div>
                  </TableCell>
                  <TableCell>
                    <div>{property.ownerName}</div>
                    <div className="text-sm text-muted-foreground">{property.ownerPhone}</div>
                  </TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell className="text-right">{formatCurrency(property.listPrice)}</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(property.annualRevenue)}</TableCell>
                  <TableCell className="text-right text-red-600">-{formatCurrency(property.expenses)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{property.roi}</TableCell>
                  <TableCell className="text-right">
                    <InvoiceButton entityName={property.address} entityType="property" />
                  </TableCell>
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
