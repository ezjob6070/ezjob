
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Technician } from '@/types/technician';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, SearchIcon, XCircle } from 'lucide-react';
import { formatCurrency } from '@/components/dashboard/DashboardUtils';
import { Badge } from '@/components/ui/badge';

interface TechnicianPaymentsSectionProps {
  technicians: Technician[];
}

type PaymentStatus = 'pending' | 'paid' | 'failed';

interface TechnicianPayment {
  id: string;
  technicianId: string;
  technicianName: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  jobCount: number;
}

const TechnicianPaymentsSection: React.FC<TechnicianPaymentsSectionProps> = ({
  technicians
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generate mock payment data based on technicians
  const mockPayments: TechnicianPayment[] = technicians.flatMap(tech => {
    if (!tech.totalRevenue) return [];
    
    const payment = {
      id: `pmt-${tech.id}-${Date.now()}`,
      technicianId: tech.id,
      technicianName: tech.name,
      amount: tech.paymentType === 'percentage' 
        ? tech.totalRevenue * (tech.paymentRate / 100) 
        : tech.paymentRate * (tech.completedJobs || 0),
      date: new Date(),
      status: Math.random() > 0.3 ? 'paid' : 'pending',
      jobCount: tech.completedJobs || 0
    } as TechnicianPayment;
    
    return [payment];
  });
  
  const filteredPayments = mockPayments.filter(payment => 
    payment.technicianName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Status badge styling
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Technician Payments</h2>
          <p className="text-muted-foreground">Track and manage payments to technicians</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button>New Payment</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.technicianName}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                  <TableCell>{payment.jobCount}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      {payment.status === 'paid' ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(
                filteredPayments
                  .filter(p => p.status === 'paid')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(
                filteredPayments
                  .filter(p => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(filteredPayments.filter(p => p.status === 'paid').length / 
                (filteredPayments.length || 1) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianPaymentsSection;
