
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobSource } from "@/types/jobSource";
import { BriefcaseIcon, DollarSignIcon, ExternalLinkIcon, PercentIcon } from "lucide-react";

interface JobSourceCardProps {
  jobSource: JobSource;
  onEdit: (jobSource: JobSource) => void;
}

const JobSourceCard = ({ jobSource, onEdit }: JobSourceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-900 relative">
        {jobSource.logoUrl ? (
          <img
            src={jobSource.logoUrl}
            alt={jobSource.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <BriefcaseIcon className="h-16 w-16 text-white/50" />
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant={jobSource.isActive ? "default" : "outline"}>
          {jobSource.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{jobSource.name}</h3>
            {jobSource.website && (
              <a href={jobSource.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {jobSource.paymentType === "percentage" ? (
                <PercentIcon className="h-3.5 w-3.5" />
              ) : (
                <DollarSignIcon className="h-3.5 w-3.5" />
              )}
              {jobSource.paymentType === "percentage" 
                ? `${jobSource.paymentValue}% per job`
                : `${formatCurrency(jobSource.paymentValue)} per job`}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded text-center">
            <p className="text-muted-foreground">Jobs</p>
            <p className="font-semibold">{jobSource.totalJobs}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <p className="text-muted-foreground">Revenue</p>
            <p className="font-semibold">{formatCurrency(jobSource.totalRevenue)}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <p className="text-muted-foreground">Profit</p>
            <p className="font-semibold">{formatCurrency(jobSource.profit)}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onEdit(jobSource)}
        >
          Edit Source
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobSourceCard;
