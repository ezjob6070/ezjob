import { Resume, RESUME_STATUS } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type ResumesListProps = {
  resumes: Resume[];
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case RESUME_STATUS.NEW:
      return "bg-blue-100 text-blue-800";
    case RESUME_STATUS.REVIEWING:
      return "bg-purple-100 text-purple-800";
    case RESUME_STATUS.INTERVIEW:
      return "bg-emerald-100 text-emerald-800";
    case RESUME_STATUS.HIRED:
      return "bg-green-100 text-green-800";
    case RESUME_STATUS.APPROVED:
      return "bg-green-100 text-green-800";  
    case RESUME_STATUS.REJECTED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ResumesList = ({ resumes, onStatusChange }: ResumesListProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id} className="bg-white">
          <CardHeader>
            <CardTitle>{resume.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Position:</span> {resume.position}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Experience:</span> {resume.experience}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Submitted:</span> {format(new Date(resume.dateSubmitted || resume.submittedDate), "MMM dd, yyyy")}
            </p>
            <Badge className={getStatusColor(resume.status)}>{resume.status}</Badge>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              {resume.status === RESUME_STATUS.NEW && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onStatusChange(resume.id, "approved")}>
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onStatusChange(resume.id, "rejected")}>
                    Reject
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ResumesList;
