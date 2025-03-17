
import { Button } from "@/components/ui/button";
import { Search, Filter, List } from "lucide-react";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import JobCard from "@/components/calendar/components/JobCard";
import TaskCard from "@/components/calendar/components/TaskCard";

interface CompactFilterBarProps {
  jobs: Job[];
  tasks: Task[];
  selectedTabValue: string;
}

const CompactFilterBar = ({ jobs, tasks, selectedTabValue }: CompactFilterBarProps) => {
  const [showAllDialog, setShowAllDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.technicianName && job.technicianName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "in_progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={selectedTabValue === "jobs" ? "Search jobs..." : "Search tasks..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5"
          onClick={() => setShowAllDialog(true)}
        >
          <List className="h-4 w-4" />
          {selectedTabValue === "jobs" ? "All Jobs" : "All Tasks"}
        </Button>
      </div>

      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedTabValue === "jobs" ? "All Jobs" : "All Tasks"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${selectedTabValue === "jobs" ? "jobs" : "tasks"}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue={selectedTabValue} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="jobs">Jobs ({filteredJobs.length})</TabsTrigger>
                <TabsTrigger value="tasks">Tasks ({filteredTasks.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="jobs" className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No jobs found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No tasks found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompactFilterBar;
