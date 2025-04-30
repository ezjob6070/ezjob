
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmployeeDocument, getDocumentTypeLabel } from "@/types/employee";
import { format } from "date-fns";
import { CalendarDays, FileText, FileType, Clock } from "lucide-react";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: () => void;
  documentData: EmployeeDocument;
}

const DocumentViewDialog = ({ open, onOpenChange, documentData }: DocumentViewDialogProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "MMM dd, yyyy");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">
            {documentData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Viewer */}
          <div className="border-2 border-dashed border-gray-200 rounded-md p-8 bg-gray-50 flex flex-col items-center justify-center h-64">
            <FileText className="h-16 w-16 text-gray-400" />
            <p className="mt-4 text-sm text-gray-500">Document Preview</p>
            <a
              href={documentData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              View Full Document
            </a>
          </div>

          {/* Document Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileType className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Type:</span>{" "}
                {documentData.type ? getDocumentTypeLabel(documentData.type) : "Other Document"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Upload Date:</span>{" "}
                {formatDate(documentData.uploadDate || documentData.dateUploaded)}
              </span>
            </div>
            
            {documentData.expiryDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {formatDate(documentData.expiryDate)}
                </span>
              </div>
            )}
            
            {documentData.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                <p className="font-medium mb-1">Notes:</p>
                <p>{documentData.notes}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
