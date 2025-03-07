
import React from "react";
import { ChevronDown, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface JobSourceFilterProps {
  jobSourceFilter: string;
  jobSources: { id: string; name: string }[];
  updateFilter: (key: "jobSourceFilter", value: string) => void;
}

const JobSourceFilter: React.FC<JobSourceFilterProps> = ({
  jobSourceFilter,
  jobSources,
  updateFilter,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Tags className="h-4 w-4" />
          {jobSourceFilter
            ? jobSources.find((s) => s.id === jobSourceFilter)?.name || "Job Source"
            : "All Job Sources"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <div className="space-y-2">
            <Button
              variant={jobSourceFilter === "" ? "default" : "outline"}
              className="w-full justify-start text-left"
              onClick={() => updateFilter("jobSourceFilter", "")}
            >
              All Job Sources
            </Button>
            {jobSources.map((source) => (
              <Button
                key={source.id}
                variant={jobSourceFilter === source.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => updateFilter("jobSourceFilter", source.id)}
              >
                {source.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default JobSourceFilter;
