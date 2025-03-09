
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const JobsPageHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Jobs
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all jobs
        </p>
      </div>

      <Button variant="outline" className="ml-auto gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Job
      </Button>
    </div>
  );
};

export default JobsPageHeader;
