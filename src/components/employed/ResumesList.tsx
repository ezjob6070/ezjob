
import { useState } from "react";
import { Resume } from "@/types/employee";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Calendar, FileText, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ResumesListProps {
  resumes: Resume[];
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
}

const ResumesList = ({ resumes, onStatusChange }: ResumesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Filter resumes based on search and status
  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch = 
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      resume.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="min-w-24"
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
            className="min-w-24"
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === "approved" ? "default" : "outline"}
            onClick={() => setStatusFilter("approved")}
            className="min-w-24"
          >
            Approved
          </Button>
          <Button 
            variant={statusFilter === "rejected" ? "default" : "outline"}
            onClick={() => setStatusFilter("rejected")}
            className="min-w-24"
          >
            Rejected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume) => (
            <Card key={resume.id} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{resume.name}</CardTitle>
                  <Badge
                    variant={
                      resume.status === "pending" 
                        ? "outline" 
                        : resume.status === "approved" 
                          ? "default" 
                          : "destructive"
                    }
                  >
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-lg font-medium">{resume.position}</p>
                <p className="text-sm text-muted-foreground">{resume.experience} experience</p>
              </CardHeader>
              
              <CardContent className="space-y-2 pb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <span>{resume.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{resume.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>Submitted on {format(resume.dateSubmitted, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-muted-foreground" />
                  <a href={resume.resumeUrl} className="text-blue-600 hover:underline">
                    View Resume
                  </a>
                </div>
                
                {resume.notes && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-md text-sm">
                    <p className="font-medium">Notes:</p>
                    <p>{resume.notes}</p>
                  </div>
                )}
              </CardContent>
              
              {resume.status === "pending" && (
                <CardFooter className="pt-2 flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-1 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                    onClick={() => onStatusChange(resume.id, "approved")}
                  >
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                    onClick={() => onStatusChange(resume.id, "rejected")}
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center bg-slate-50 rounded-lg">
            <p className="text-muted-foreground">No resumes found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumesList;
