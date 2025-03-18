
import { format } from "date-fns";
import { FileText, Eye, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmployeeDocument, DocumentType } from "@/types/employee";

interface DocumentListItemProps {
  document: EmployeeDocument;
  getDocumentTypeLabel: (type: DocumentType) => string;
  onViewDocument: (document: EmployeeDocument) => void;
  onDeleteDocument: (documentId: string) => void;
}

const DocumentListItem = ({
  document,
  getDocumentTypeLabel,
  onViewDocument,
  onDeleteDocument
}: DocumentListItemProps) => {
  return (
    <div 
      key={document.id} 
      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-10 w-10 text-blue-500" />
        <div>
          <p className="font-medium">{document.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{getDocumentTypeLabel(document.type)}</Badge>
            <span>Uploaded on {format(document.dateUploaded, "MMM d, yyyy")}</span>
          </div>
          
          {document.expiryDate && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <Calendar className="h-3 w-3" />
              <span className={`${
                new Date(document.expiryDate) < new Date() 
                  ? "text-destructive" 
                  : "text-muted-foreground"
              }`}>
                Expires: {format(document.expiryDate, "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onViewDocument(document)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDeleteDocument(document.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentListItem;
