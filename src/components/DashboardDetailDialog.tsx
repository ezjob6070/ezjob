import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, FileText, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  data?: any[];
  type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics';
};

const DashboardDetailDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  data = [],
  type
}: DashboardDetailDialogProps) => {
  const renderContent = () => {
    switch (type) {
      case 'tasks':
        return (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.client}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={
                        task.status === 'Completed' ? 'success' : 
                        task.status === 'In Progress' ? 'default' : 
                        task.status === 'Pending' ? 'secondary' : 
                        'destructive'
                      }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        task.priority === 'High' ? 'destructive' : 
                        task.priority === 'Medium' ? 'default' : 
                        'secondary'
                      }>
                        {task.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        );
      
      case 'leads':
        return (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>${lead.value}</TableCell>
                    <TableCell>
                      <Badge variant={
                        lead.status === 'Qualified' ? 'success' : 
                        lead.status === 'New' ? 'default' : 
                        lead.status === 'Contacting' ? 'secondary' : 
                        'outline'
                      }>
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        );
      
      case 'revenue':
        return (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === 'Paid' ? 'success' : 
                        invoice.status === 'Pending' ? 'warning' : 
                        'destructive'
                      }>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        );
      
      case 'clients':
        return (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.projects}</TableCell>
                    <TableCell>${client.totalValue}</TableCell>
                    <TableCell>
                      <Badge variant={
                        client.status === 'Active' ? 'success' : 
                        client.status === 'Inactive' ? 'secondary' : 
                        'outline'
                      }>
                        {client.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        );
      
      case 'metrics':
        return (
          <div className="grid grid-cols-2 gap-4">
            {data.map((metric, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm text-muted-foreground">{metric.label}</h3>
                <div className="text-2xl font-bold mt-1">{metric.value}</div>
                {metric.change && (
                  <div className={cn(
                    "text-xs font-medium mt-1",
                    metric.change > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return children;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDetailDialog;
