
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard
} from "lucide-react";

const Finance = () => {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your company finances and generate reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/finance/overview">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Finance Overview</h3>
              <p className="text-muted-foreground">
                View overall financial metrics and KPIs for your business
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/finance/job-sources">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Job Source Finance</h3>
              <p className="text-muted-foreground">
                Analyze revenue and expenses by job source
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/finance/technicians">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Technician Finance</h3>
              <p className="text-muted-foreground">
                Track technician performance and earnings
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/finance/transactions">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transactions</h3>
              <p className="text-muted-foreground">
                View recent financial transactions and payment history
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Finance;
