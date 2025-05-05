
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, CheckCircle, Clock, XCircle, CalendarClock } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

type JobStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  status: string;
  data: any[];
};

const JobStatusDialog = ({
  open,
  onOpenChange,
  title,
  status,
  data,
}: JobStatusDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data by search term
  const filteredData = data.filter((item) => {
    if (searchTerm === "") return true;
    
    return Object.values(item).some(
      (value) => 
        value && 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get status badge style
  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Completed</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Cancelled</Badge>;
      case 'submitted':
        return <Badge className="bg-amber-100 text-amber-800 border border-amber-200">Submitted</Badge>;
      case 'rescheduled':
        return <Badge className="bg-purple-100 text-purple-800 border border-purple-200">Rescheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'rescheduled':
        return <CalendarClock className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <DialogTitle>{title}</DialogTitle>
            {getStatusBadge()}
            <div className="text-sm text-muted-foreground ml-2">
              ({filteredData.length} jobs)
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex items-center gap-2 py-3 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3 py-4">
            {filteredData.length > 0 ? (
              filteredData.map((job, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{job.client}</h4>
                        <Badge variant="outline" className="text-xs">
                          {job.id}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{job.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(job.amount)}</div>
                      <div className="text-sm text-gray-500">{job.date}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                      {job.taskType}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100">
                      Tech: {job.technician}
                    </Badge>
                    {job.newDate && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">
                        Rescheduled to: {job.newDate}
                      </Badge>
                    )}
                    {job.reason && (
                      <div className="w-full mt-1 text-sm text-red-600">
                        <span className="font-medium">Reason:</span> {job.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mb-2 text-lg font-medium">No jobs found</div>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t pt-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredData.length} total jobs
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobStatusDialog;
