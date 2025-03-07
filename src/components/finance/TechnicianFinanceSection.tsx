
import React from "react";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TechnicianFinanceSectionProps {
  activeTechnicians: Technician[];
}

const TechnicianFinanceSection: React.FC<TechnicianFinanceSectionProps> = ({
  activeTechnicians,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Technician Finance</h3>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Completed Jobs</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTechnicians.map((tech) => (
                    <TableRow key={tech.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                            {tech.initials}
                          </div>
                          <span>{tech.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tech.specialty}</TableCell>
                      <TableCell>{tech.completedJobs}</TableCell>
                      <TableCell>{formatCurrency(tech.totalRevenue)}</TableCell>
                      <TableCell>{tech.paymentType === "percentage" ? `${tech.paymentRate}%` : "Flat"}</TableCell>
                      <TableCell>
                        {formatCurrency(tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianFinanceSection;
