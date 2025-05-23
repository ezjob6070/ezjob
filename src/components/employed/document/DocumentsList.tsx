
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  documents = [],
  onViewDocument,
  onDeleteDocument,
  getDocumentTypeLabel
}: DocumentsListProps) => {
  // Add null check and default to empty array if documents is null or undefined
  const documentsList = documents || [];
  
  if (documentsList.length === 0) {
    return <EmptyDocumentState />;
  }
  
  return (
    <div className="space-y-4">
      {documentsList.map((document) => (
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
