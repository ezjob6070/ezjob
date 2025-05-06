
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, X } from "lucide-react";

// Update the props interface to use data instead of jobs
export interface JobStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  status: string;
  data: any[];
}

const JobStatusDialog = ({ open, onOpenChange, title, status, data }: JobStatusDialogProps) => {
  const getStatusIcon = (jobStatus: string) => {
    switch (jobStatus.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (jobStatus: string) => {
    switch (jobStatus.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-200";
      case 'in progress':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'cancelled':
        return "bg-red-100 text-red-800 border-red-200";
      case 'scheduled':
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getStatusIcon(status)}
            <span className="ml-2">{title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3">
            {data && data.length > 0 ? (
              data.map((job, index) => (
                <div key={index} className="p-3 rounded-lg bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{job.title || job.name || "Untitled Job"}</h3>
                      <div className="text-xs text-gray-500 mt-1">{job.client || job.customer || "Unknown Client"}</div>
                    </div>
                    <Badge className={`${getStatusBadgeColor(job.status)}`}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">Scheduled: </span>
                      <span>{job.date || job.scheduledDate || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value: </span>
                      <span>${job.value || job.amount || 0}</span>
                    </div>
                    {job.technician && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Technician: </span>
                        <span>{job.technician}</span>
                      </div>
                    )}
                    {job.address && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Location: </span>
                        <span>{job.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No {status.toLowerCase()} jobs found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JobStatusDialog;
