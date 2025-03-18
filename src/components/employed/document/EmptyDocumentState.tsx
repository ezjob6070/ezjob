
import { FileText } from "lucide-react";

const EmptyDocumentState = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
      <p className="text-muted-foreground">No documents uploaded yet</p>
      <p className="text-sm text-muted-foreground mt-1">
        Upload employee documents like ID, passport, or work permits
      </p>
    </div>
  );
};

export default EmptyDocumentState;
