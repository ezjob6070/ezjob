
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobSourceFilterProps {
  jobSources: { id: string; name: string }[];
  onChange: (value: string) => void;
  value: string; // Added value prop to match the calling component
}

const JobSourceFilter: React.FC<JobSourceFilterProps> = ({
  jobSources,
  onChange,
  value
}) => {
  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-full bg-white border border-gray-200">
        <SelectValue placeholder="Filter by job source" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Job Sources</SelectItem>
        {jobSources.map((source) => (
          <SelectItem key={source.id} value={source.id}>
            {source.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default JobSourceFilter;
