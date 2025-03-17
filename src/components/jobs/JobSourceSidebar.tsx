
import { useState } from "react";
import { Plus, FolderIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { JobSource } from "@/types/jobSource";
import JobSourceCard from "../jobSources/JobSourceCard";

interface JobSourceSidebarProps {
  jobSources: JobSource[];
  isOpen: boolean;
  onClose: () => void;
  onAddJobSource: () => void;
  onEditJobSource: (jobSource: JobSource) => void;
}

const JobSourceSidebar = ({
  jobSources,
  isOpen,
  onClose,
  onAddJobSource,
  onEditJobSource
}: JobSourceSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSources = jobSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-16 z-20 w-80 bg-white border-r shadow-lg pt-16 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <FolderIcon className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Job Sources</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full" 
          onClick={onAddJobSource}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Job Source
        </Button>
      </div>
      
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search sources..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredSources.length > 0 ? (
            filteredSources.map((source) => (
              <div key={source.id} className="group">
                <JobSourceCard 
                  jobSource={source} 
                  onEdit={onEditJobSource}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No sources found" : "No job sources yet"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default JobSourceSidebar;
