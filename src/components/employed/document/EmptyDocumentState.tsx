
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDocumentStateProps {
  onUpload?: () => void;
}

const EmptyDocumentState = ({ onUpload }: EmptyDocumentStateProps = {}) => {
  return (
    <div className="text-center py-8 border border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">No documents uploaded yet</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        Upload employee documents like ID, passport, work permits, or other important files
      </p>
      
      {onUpload && (
        <Button variant="outline" onClick={onUpload} className="mt-2">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      )}
    </div>
  );
};

export default EmptyDocumentState;
