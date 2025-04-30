
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FilePlus, Trash2, Eye, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeDocument, getDocumentTypeLabel } from "@/types/employee";
import { useEmployeeDocuments } from "@/hooks/employed/useEmployeeDocuments";
import DocumentsList from "./document/DocumentsList";
import DocumentUploadForm from "./document/DocumentUploadForm";
import DocumentViewDialog from "./document/DocumentViewDialog";

interface EmployeeDocumentsProps {
  employeeId: string;
  documents: EmployeeDocument[];
  onUpdateEmployee: (updatedDocuments: EmployeeDocument[]) => void;
}

const EmployeeDocuments = ({ employeeId, documents, onUpdateEmployee }: EmployeeDocumentsProps) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EmployeeDocument | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const { toast } = useToast();
  const { uploadDocument, deleteDocument } = useEmployeeDocuments(employeeId);

  const handleDocumentUpload = async (documentData: any) => {
    try {
      const newDocument = await uploadDocument(documentData);
      const updatedDocuments = [...documents, newDocument];
      onUpdateEmployee(updatedDocuments);
      
      setShowUploadForm(false);
      
      toast({
        title: "Document Uploaded",
        description: `${documentData.name} has been successfully uploaded.`,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Error",
        description: "There was a problem uploading the document.",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (document: EmployeeDocument) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  const handleDeleteClick = (document: EmployeeDocument) => {
    setSelectedDocument(document);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await deleteDocument(selectedDocument.id);
      
      const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
      onUpdateEmployee(updatedDocuments);
      
      setIsConfirmDeleteOpen(false);
      setSelectedDocument(null);
      
      toast({
        title: "Document Deleted",
        description: `${selectedDocument.name} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Error",
        description: "There was a problem deleting the document.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowUploadForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <Button onClick={() => setShowUploadForm(true)} className="gap-2">
          <FilePlus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {showUploadForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Document</CardTitle>
            <CardDescription>
              Add a document to this employee's record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploadForm 
              onSubmit={handleDocumentUpload}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      ) : (
        <DocumentsList 
          documents={documents} 
          onViewDocument={handleViewDocument}
          onDeleteDocument={handleDeleteClick}
          getDocumentTypeLabel={getDocumentTypeLabel}
        />
      )}

      {selectedDocument && (
        <>
          {/* Document Viewer Dialog */}
          <DocumentViewDialog 
            open={showViewDialog}
            onOpenChange={() => setShowViewDialog(false)}
            documentData={selectedDocument}
          />

          {/* Confirm Delete Dialog */}
          <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete '{selectedDocument.name}'? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfirmDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default EmployeeDocuments;
