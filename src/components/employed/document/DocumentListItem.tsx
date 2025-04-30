
import { format } from "date-fns";
import { FileText, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeeDocument } from "@/types/employee";

interface DocumentListItemProps {
  document: EmployeeDocument;
  onView: () => void;
  onDelete: () => void;
  getDocumentTypeLabel: (type: string) => string;
}

const DocumentListItem = ({ 
  document, 
  onView, 
  onDelete,
  getDocumentTypeLabel 
}: DocumentListItemProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Invalid date format:", error);
      return "Invalid date";
    }
  };

  // Safely handle document's properties with null checks
  const documentName = document?.name || "Unnamed Document";
  const documentType = document?.type ? getDocumentTypeLabel(document.type) : "Other Document";
  const uploadDate = document?.uploadDate || document?.dateUploaded || undefined;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium">{documentName}</h4>
              <p className="text-xs text-muted-foreground">
                {documentType}
              </p>
              <p className="text-xs text-muted-foreground">
                Uploaded: {formatDate(uploadDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
