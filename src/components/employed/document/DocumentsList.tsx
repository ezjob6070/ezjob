
import { EmployeeDocument, DocumentType } from "@/types/employee";
import DocumentListItem from "./DocumentListItem";
import EmptyDocumentState from "./EmptyDocumentState";

interface DocumentsListProps {
  documents: EmployeeDocument[];
  getDocumentTypeLabel: (type: DocumentType) => string;
  onViewDocument: (document: EmployeeDocument) => void;
  onDeleteDocument: (documentId: string) => void;
}

const DocumentsList = ({
  documents,
  getDocumentTypeLabel,
  onViewDocument,
  onDeleteDocument
}: DocumentsListProps) => {
  if (documents.length === 0) {
    return <EmptyDocumentState />;
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <DocumentListItem
          key={document.id}
          document={document}
          getDocumentTypeLabel={getDocumentTypeLabel}
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      ))}
    </div>
  );
};

export default DocumentsList;
