
import { useState } from "react";
import { Plus, FolderIcon, X, Search, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { JobSource } from "@/types/jobSource";

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
  
  const filteredSources = jobSources.filter(source => {
    if (!searchQuery) return true;
    
    const search = searchQuery.toLowerCase();
    
    // Search by name, phone, email, or website
    const matchesName = source.name.toLowerCase().includes(search);
    const matchesPhone = source.phone?.toLowerCase().includes(search) || false;
    const matchesEmail = source.email?.toLowerCase().includes(search) || false;
    const matchesWebsite = source.website?.toLowerCase().includes(search) || false;
    
    return matchesName || matchesPhone || matchesEmail || matchesWebsite;
  });

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
            placeholder="Search by name, phone, email..." 
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
              <Card key={source.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{source.name}</h3>
                        {!source.isActive && <Badge variant="outline" className="text-xs">Inactive</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {source.paymentType === "percentage" ? 
                          `${source.paymentValue}% of job value` : 
                          `$${source.paymentValue.toFixed(2)} per job`}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => onEditJobSource(source)}
                    >
                      Edit
                    </Button>
                  </div>
                  
                  {source.notes && (
                    <div className="mb-2 text-sm text-muted-foreground border-l-2 border-muted pl-2">
                      {source.notes}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {source.phone && (
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{source.phone}</span>
                      </div>
                    )}
                    
                    {source.email && (
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a 
                          href={`mailto:${source.email}`}
                          className="text-xs text-blue-600 hover:underline overflow-hidden overflow-ellipsis"
                        >
                          {source.email}
                        </a>
                      </div>
                    )}
                    
                    {source.website && (
                      <div className="flex items-center gap-2 text-xs">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <a 
                          href={source.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline overflow-hidden overflow-ellipsis"
                        >
                          {source.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="px-4 py-2 border-t flex justify-between">
                  <span className="text-xs">{source.totalJobs} jobs</span>
                  <span className="text-xs font-medium">${source.totalRevenue.toLocaleString()}</span>
                </CardFooter>
              </Card>
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
