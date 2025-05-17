import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialTransaction, PaymentStatus } from "@/types/finance";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import FinancialTransactionsTable from "./FinancialTransactionsTable";
import { Badge } from "@/components/ui/badge";

interface TransactionsSectionProps {
  filteredTransactions: FinancialTransaction[];
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  filteredTransactions,
  dateRange
}) => {
  const [activeTab, setActiveTab] = useState<PaymentStatus>("completed");
  const [searchTerm, setSearchTerm] = useState("");

  // Get counts for different transaction statuses
  const getStatusCounts = () => {
    const counts = {
      total: filteredTransactions.length,
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      cancelled: 0
    };
    
    filteredTransactions.forEach(transaction => {
      if (transaction.status === "completed") {
        counts.completed++;
      } else if (transaction.status === "pending") {
        counts.pending++;
      } else if (transaction.status === "failed") {
        counts.failed++;
      } else if (transaction.status === "refunded") {
        counts.refunded++;
      } else if (transaction.status === "cancelled") {
        counts.cancelled++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track income, expenses, and refunds.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="completed" className="space-y-4">
            <TabsList>
              <TabsTrigger value="completed">
                <Badge variant="secondary">
                  Completed ({statusCounts.completed})
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Badge variant="secondary">
                  Pending ({statusCounts.pending})
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="failed">
                <Badge variant="destructive">
                  Failed ({statusCounts.failed})
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="refunded">
                <Badge variant="outline">
                  Refunded ({statusCounts.refunded})
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                <Badge variant="outline">
                  Cancelled ({statusCounts.cancelled})
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="completed">
              <FinancialTransactionsTable 
                transactions={filteredTransactions.filter(t => t.status === "completed")} 
                searchTerm={searchTerm} 
              />
            </TabsContent>
            <TabsContent value="pending">
              <FinancialTransactionsTable 
                transactions={filteredTransactions.filter(t => t.status === "pending")} 
                searchTerm={searchTerm} 
              />
            </TabsContent>
            <TabsContent value="failed">
              <FinancialTransactionsTable 
                transactions={filteredTransactions.filter(t => t.status === "failed")} 
                searchTerm={searchTerm} 
              />
            </TabsContent>
            <TabsContent value="refunded">
              <FinancialTransactionsTable 
                transactions={filteredTransactions.filter(t => t.status === "refunded")} 
                searchTerm={searchTerm} 
              />
            </TabsContent>
            <TabsContent value="cancelled">
              <FinancialTransactionsTable 
                transactions={filteredTransactions.filter(t => t.status === "cancelled")} 
                searchTerm={searchTerm} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsSection;
