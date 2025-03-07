import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Job } from "@/components/jobs/JobTypes";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import { initialJobs } from "@/data/jobs";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  // Function to handle job cancellation
  const handleCancelJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "cancelled" } : job
      )
    );
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all jobs
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <JobStats jobs={filteredJobs} />
      
      <JobTabs 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob} 
      />
    </div>
  );
};

export default Jobs;
