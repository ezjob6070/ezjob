
import { Button } from "@/components/ui/button";
import { Search, Filter, List } from "lucide-react";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "@/components/calendar/components/JobCard";
import TaskCard from "@/components/calendar/components/TaskCard";
import { toast } from "sonner";

interface CompactFilterBarProps {
  jobs: Job[];
  tasks: Task[];
  selectedTabValue: string;
}

const CompactFilterBar = ({ jobs, tasks, selectedTabValue }: CompactFilterBarProps) => {
  const [showAllDialog, setShowAllDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogTabValue, setDialogTabValue] = useState(selectedTabValue);
  
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

  const handleOpenDialog = () => {
    setDialogTabValue(selectedTabValue);
    setShowAllDialog(true);
  };

  const handleApplyFilter = () => {
    toast.success(`Filter applied: "${searchTerm}"`);
    setShowAllDialog(false);
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
          onClick={handleOpenDialog}
        >
          <List className="h-4 w-4" />
          {selectedTabValue === "jobs" ? "All Jobs" : "All Tasks"}
        </Button>
      </div>

      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{dialogTabValue === "jobs" ? "All Jobs" : "All Tasks"}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${dialogTabValue === "jobs" ? "jobs" : "tasks"}...`}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue={selectedTabValue} 
              value={dialogTabValue}
              onValueChange={setDialogTabValue}
              className="w-full"
            >
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
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAllDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilter}>
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompactFilterBar;
