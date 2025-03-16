
import { format } from "date-fns";
import { BriefcaseIcon, ChevronLeft, ChevronRight, ClipboardListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/components/jobs/JobTypes";
import JobCard from "./JobCard";
import TaskCard from "./TaskCard";
import { Task } from "../types";

interface DaySummaryProps {
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const DaySummary = ({ 
  selectedDate, 
  jobsForSelectedDate, 
  tasksForSelectedDate,
  onPreviousDay,
  onNextDay
}: DaySummaryProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-medium">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Jobs Section */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4" />
          Jobs ({jobsForSelectedDate.length})
        </h3>
        
        {jobsForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {jobsForSelectedDate.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      
      {/* Tasks Section */}
      <div className="space-y-3">
        <h3 className="font-medium flex items-center gap-2">
          <ClipboardListIcon className="h-4 w-4" />
          Tasks ({tasksForSelectedDate.length})
        </h3>
        
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
        ) : (
          <div className="space-y-2">
            {tasksForSelectedDate.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySummary;
