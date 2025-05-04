
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Download, Check, X } from 'lucide-react';
import { Resume, RESUME_STATUS } from '@/types/employee';

export interface ResumesListProps {
  resumes: Resume[];
  onStatusChange?: (resume: Resume, newStatus: RESUME_STATUS) => void;
}

const ResumesList: React.FC<ResumesListProps> = ({ resumes, onStatusChange }) => {
  // Helper function to determine badge styling based on status
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case RESUME_STATUS.NEW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case RESUME_STATUS.REVIEWING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case RESUME_STATUS.INTERVIEW:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case RESUME_STATUS.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case RESUME_STATUS.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case RESUME_STATUS.HIRED:
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleStatusChange = (resume: Resume, newStatus: RESUME_STATUS) => {
    if (onStatusChange) {
      onStatusChange(resume, newStatus);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.length > 0 ? (
            resumes.map(resume => (
              <TableRow key={resume.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{resume.name}</div>
                    <div className="text-xs text-muted-foreground">{resume.email}</div>
                  </div>
                </TableCell>
                <TableCell>{resume.position}</TableCell>
                <TableCell>{resume.experience}</TableCell>
                <TableCell>{formatDate(resume.dateSubmitted)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeStyle(resume.status)}>
                    {resume.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Resume
                    </Button>
                    {onStatusChange && resume.status !== RESUME_STATUS.APPROVED && resume.status !== RESUME_STATUS.REJECTED && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-green-50 text-green-600 hover:bg-green-100"
                          onClick={() => handleStatusChange(resume, RESUME_STATUS.APPROVED)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-red-50 text-red-600 hover:bg-red-100"
                          onClick={() => handleStatusChange(resume, RESUME_STATUS.REJECTED)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No resumes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResumesList;
