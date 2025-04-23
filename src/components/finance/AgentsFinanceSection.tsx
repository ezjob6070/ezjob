
import { DateRange } from "react-day-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface AgentsFinanceSectionProps {
  date?: DateRange;
}

const AgentsFinanceSection = ({ date }: AgentsFinanceSectionProps) => {
  // Sample data for agents' financial performance
  const agentsData = [
    { 
      name: "Sarah Miller",
      listings: 24,
      sales: 18,
      revenue: 285000,
      commission: 8550,
      performance: "+12%"
    },
    {
      name: "John Davis",
      listings: 19,
      sales: 15,
      revenue: 245000,
      commission: 7350,
      performance: "+8%"
    },
    {
      name: "Emily Wilson",
      listings: 22,
      sales: 14,
      revenue: 215000,
      commission: 6450,
      performance: "+5%"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Total Commission</div>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(22350)}</div>
            <div className="text-sm text-purple-600 mt-2">+8.3% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Active Agents</div>
            <div className="text-2xl font-bold text-blue-700">12</div>
            <div className="text-sm text-blue-600 mt-2">2 new this month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-2">Avg. Sale Price</div>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(425000)}</div>
            <div className="text-sm text-emerald-600 mt-2">+5.2% from last month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Active Listings</TableHead>
                <TableHead>Closed Sales</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentsData.map((agent) => (
                <TableRow key={agent.name}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.listings}</TableCell>
                  <TableCell>{agent.sales}</TableCell>
                  <TableCell className="text-right">{formatCurrency(agent.revenue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(agent.commission)}</TableCell>
                  <TableCell className="text-right text-green-600">{agent.performance}</TableCell>
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
