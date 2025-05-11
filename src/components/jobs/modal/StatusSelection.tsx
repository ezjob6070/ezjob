// Assuming this file exists and we're adding the missing property
import React from 'react';
import { JobStatus } from '@/types/job';

export interface StatusSelectionProps {
  currentStatus: JobStatus;
  onStatusChange: (status: string) => void;
}

const StatusSelection: React.FC<StatusSelectionProps> = ({ currentStatus, onStatusChange }) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          value="scheduled"
          checked={currentStatus === 'scheduled'}
          onChange={() => onStatusChange('scheduled')}
        />
        Scheduled
      </label>
      <label>
        <input
          type="radio"
          value="in_progress"
          checked={currentStatus === 'in_progress'}
          onChange={() => onStatusChange('in_progress')}
        />
        In Progress
      </label>
      <label>
        <input
          type="radio"
          value="completed"
          checked={currentStatus === 'completed'}
          onChange={() => onStatusChange('completed')}
        />
        Completed
      </label>
      <label>
        <input
          type="radio"
          value="canceled"
          checked={currentStatus === 'canceled'}
          onChange={() => onStatusChange('canceled')}
        />
        Canceled
      </label>
    </div>
  );
};

export default StatusSelection;
