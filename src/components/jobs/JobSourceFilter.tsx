
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JobSourceFilterProps {
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
}

const JobSourceFilter = ({
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  selectAllJobSources,
  deselectAllJobSources
}: JobSourceFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSources = jobSourceNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const allSelected = jobSourceNames.length > 0 && 
    selectedJobSources.length === jobSourceNames.length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Source Filter</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAllJobSources}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAllJobSources}
            disabled={selectedJobSources.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search sources..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Checkbox
          id="job-sources-all"
          checked={allSelected}
          onCheckedChange={(checked) => {
            if (checked) {
              selectAllJobSources();
            } else {
              deselectAllJobSources();
            }
          }}
        />
        <Label
          htmlFor="job-sources-all"
          className="text-sm font-medium ml-2"
        >
          All Sources
        </Label>
      </div>

      <ScrollArea className="h-72 pr-4">
        <div className="space-y-1">
          {filteredSources.map((sourceName) => (
            <div key={sourceName} className="flex items-center">
              <Checkbox
                id={`job-source-${sourceName}`}
                checked={selectedJobSources.includes(sourceName)}
                onCheckedChange={() => toggleJobSource(sourceName)}
              />
              <Label
                htmlFor={`job-source-${sourceName}`}
                className="text-sm ml-2"
              >
                {sourceName}
              </Label>
            </div>
          ))}
          
          {filteredSources.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No sources found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default JobSourceFilter;
