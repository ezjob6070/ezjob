
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateRangeFilter from "./technician-filters/DateRangeFilter";
import InvoiceButton from "./InvoiceButton";

interface AgentsFinanceSectionProps {
  date?: DateRange;
}

const AgentsFinanceSection = ({ date: initialDate }: AgentsFinanceSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"revenue" | "commission" | "deals">("revenue");
  const [date, setDate] = useState<DateRange | undefined>(initialDate);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Sample data for agents' financial performance
  const agentsData = [
    { 
      name: "Sarah Miller",
      listings: 24,
      sales: 18,
      revenue: 285000,
      commission: 8550,
      companyProfit: 5700,
      totalSalesRevenue: 950000,
      performance: "+12%",
      deals: 15,
      avgDealSize: 63333,
      status: "active"
    },
    {
      name: "John Davis",
      listings: 19,
      sales: 15,
      revenue: 245000,
      commission: 7350,
      companyProfit: 4900,
      totalSalesRevenue: 816667,
      performance: "+8%",
      deals: 12,
      avgDealSize: 68056,
      status: "active"
    },
    {
      name: "Emily Wilson",
      listings: 22,
      sales: 14,
      revenue: 215000,
      commission: 6450,
      companyProfit: 4300,
      totalSalesRevenue: 716667,
      performance: "+5%",
      deals: 11,
      avgDealSize: 65152,
      status: "active"
    }
  ];

  const filteredAgents = agentsData.filter(agent =>
    (agent.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "all" || agent.status === statusFilter)
  ).sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.totalSalesRevenue - a.totalSalesRevenue;
      case "commission":
        return b.commission - a.commission;
      case "deals":
        return b.deals - a.deals;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Filters Section */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <DateRangeFilter date={date} setDate={setDate} />
            
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="active">Active Agents</SelectItem>
                <SelectItem value="inactive">Inactive Agents</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: "revenue" | "commission" | "deals") => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Sort by Revenue</SelectItem>
                <SelectItem value="commission">Sort by Commission</SelectItem>
                <SelectItem value="deals">Sort by Deals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Total Commission</div>
              <div className="text-2xl font-bold text-red-700">-{formatCurrency(22350)}</div>
              <div className="text-sm text-blue-600 mt-2">+8.3% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Net Company Profit</div>
              <div className="text-2xl font-bold text-emerald-700">{formatCurrency(14900)}</div>
              <div className="text-sm text-emerald-600 mt-2">+6.2% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Total Sales Revenue</div>
              <div className="text-2xl font-bold text-violet-700">{formatCurrency(2483334)}</div>
              <div className="text-sm text-violet-600 mt-2">+12.5% from last month</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-2">Avg. Deal Size</div>
              <div className="text-2xl font-bold text-amber-700">{formatCurrency(65556)}</div>
              <div className="text-sm text-amber-600 mt-2">+4.8% from last month</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agent Financial Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Active Listings</TableHead>
                <TableHead>Closed Deals</TableHead>
                <TableHead className="text-right">Sales Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Company Profit</TableHead>
                <TableHead className="text-right">Avg. Deal Size</TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.name}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.listings}</TableCell>
                  <TableCell>{agent.deals}</TableCell>
                  <TableCell className="text-right">{formatCurrency(agent.totalSalesRevenue)}</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(agent.commission)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{formatCurrency(agent.companyProfit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(agent.avgDealSize)}</TableCell>
                  <TableCell className="text-right text-green-600">{agent.performance}</TableCell>
                  <TableCell className="text-right">
                    <InvoiceButton entityName={agent.name} entityType="agent" />
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

export default AgentsFinanceSection;
