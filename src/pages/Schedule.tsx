import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Job } from "@/types/finance"; // Import Job from the correct file
import { Job as JobType } from "@/components/jobs/JobTypes"; // Import conflicting Job type with alias

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [jobs, setJobs] = useState<JobType[]>([]);
  const { jobs: fetchedJobs } = useGlobalState();

  useEffect(() => {
    // Properly convert between types when needed
    const convertToJobType = (jobs: Job[]): JobType[] => {
      return jobs.map(job => ({
        ...job,
        date: job.date || new Date().toISOString(), // Ensure date property exists
      } as unknown as JobType));
    };

    // Use the conversion function when setting state
    setJobs(convertToJobType(fetchedJobs));
  }, [fetchedJobs]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Schedule</h1>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold">Select a Date</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {date && (
        <div>
          <h3 className="text-xl font-semibold mb-3">
            Jobs for {format(date, "PPP")}
          </h3>
          {jobs.length > 0 ? (
            <ul>
              {jobs.map((job) => (
                <li key={job.id} className="mb-2">
                  {job.title} - {job.clientName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No jobs scheduled for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
