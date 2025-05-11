
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JobStatus } from '@/types/job';
import { Job } from '@/types/job';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import StatusSelection from './modal/StatusSelection';

interface UpdateJobStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onUpdateStatus: (jobId: string, newStatus: string, notes?: string, cancellationReason?: string) => void;
}

const UpdateJobStatusModal: React.FC<UpdateJobStatusModalProps> = ({
  open,
  onOpenChange,
  job,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>("scheduled");
  const [notes, setNotes] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  
  useEffect(() => {
    if (job) {
      // Normalize status to handle variations
      let normalizedStatus: JobStatus = "scheduled";
      const currentStatus = job.status.toLowerCase();
      
      if (currentStatus === "scheduled") {
        normalizedStatus = "scheduled";
      } else if (currentStatus === "in-progress" || currentStatus === "in_progress") {
        normalizedStatus = "in_progress";
      } else if (currentStatus === "completed") {
        normalizedStatus = "completed";
      } else if (currentStatus === "canceled" || currentStatus === "cancelled") {
        normalizedStatus = "cancelled";
      } else if (currentStatus === "reschedule" || currentStatus === "rescheduled") {
        normalizedStatus = "reschedule";
      } else if (currentStatus === "estimate") {
        normalizedStatus = "estimate";
      }
      
      setSelectedStatus(normalizedStatus);
      setNotes("");
      setCancellationReason("");
      
      // If job has parts, check if they're all ready
      const allPartsReady = job.parts && job.parts.every(part => part.status === 'ready');
      // If job has cancellation reason, set it
      if (job.cancellationReason) {
        setCancellationReason(job.cancellationReason);
      }
    }
  }, [job]);
  
  const handleSubmit = () => {
    if (job) {
      const additionalInfo = selectedStatus === "cancelled" 
        ? cancellationReason 
        : notes;
      onUpdateStatus(job.id, selectedStatus, additionalInfo, selectedStatus === "cancelled" ? cancellationReason : undefined);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Job Status</DialogTitle>
        </DialogHeader>
        
        {job && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Job: {job.title || `Job #${job.id.substring(0, 8)}`}</h3>
                <p className="text-sm text-muted-foreground">{job.clientName}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Update Status</Label>
                <StatusSelection 
                  currentStatus={selectedStatus} 
                  onStatusChange={(status) => setSelectedStatus(status as JobStatus)} 
                />
              </div>
              
              {selectedStatus === "cancelled" ? (
                <div className="space-y-2">
                  <Label htmlFor="cancellation-reason">Cancellation Reason</Label>
                  <Textarea
                    id="cancellation-reason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Enter reason for cancellation..."
                    className="min-h-[80px]"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="status-notes">Notes (Optional)</Label>
                  <Textarea
                    id="status-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status update..."
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Update Status</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobStatusModal;
