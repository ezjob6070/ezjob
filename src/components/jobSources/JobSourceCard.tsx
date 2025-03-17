
import { Edit, Globe, Mail, Phone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { JobSource } from "@/types/jobSource";

interface JobSourceCardProps {
  jobSource: JobSource;
  onEdit: (jobSource: JobSource) => void;
}

const JobSourceCard = ({ jobSource, onEdit }: JobSourceCardProps) => {
  // Format date to be more readable
  const formattedDate = jobSource.createdAt 
    ? new Date(jobSource.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <Card className={`overflow-hidden transition-all ${!jobSource.isActive && 'opacity-70'}`}>
      <CardHeader className="pb-3 pt-5 px-5 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{jobSource.name}</h3>
            {!jobSource.isActive && <Badge variant="outline" className="text-xs">Inactive</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Added on {formattedDate}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onEdit(jobSource)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="px-5 pb-3">
        <div className="space-y-3">
          <div className="grid gap-1">
            {jobSource.paymentType === "percentage" ? (
              <div className="text-sm font-medium">
                Payment: {jobSource.paymentValue}% of job value
              </div>
            ) : (
              <div className="text-sm font-medium">
                Payment: ${jobSource.paymentValue.toFixed(2)} per job
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            {jobSource.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={jobSource.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline overflow-hidden overflow-ellipsis"
                >
                  {jobSource.website}
                </a>
              </div>
            )}
            
            {jobSource.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{jobSource.phone}</span>
              </div>
            )}
            
            {jobSource.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${jobSource.email}`}
                  className="text-blue-600 hover:underline overflow-hidden overflow-ellipsis"
                >
                  {jobSource.email}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {jobSource.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">{jobSource.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-5 pt-0 pb-4 flex justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-amber-500" />
          <span>{jobSource.totalJobs} jobs</span>
        </div>
        <div className="text-sm font-medium">
          ${jobSource.totalRevenue.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobSourceCard;
