
import { format } from "date-fns";
import { FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeDocument } from "@/types/employee";
import EmptyDocumentState from "./EmptyDocumentState";
import DocumentListItem from "./DocumentListItem";

interface DocumentsListProps {
  documents: EmployeeDocument[];
  onViewDocument: (document: EmployeeDocument) => void;
  onDeleteDocument: (documentId: string) => void;
  getDocumentTypeLabel: (type: string) => string;
}

const DocumentsList = ({ 
  documents,
  onViewDocument,
  onDeleteDocument,
  getDocumentTypeLabel
}: DocumentsListProps) => {
  if (!documents || documents.length === 0) {
    return <EmptyDocumentState />;
  }
  
  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          onView={() => onViewDocument(document)}
          onDelete={() => onDeleteDocument(document.id)}
          getDocumentTypeLabel={getDocumentTypeLabel}
        />
      ))}
    </div>
  );
};

export default DocumentsList;
