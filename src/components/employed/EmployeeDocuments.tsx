import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DOCUMENT_TYPE, EmployeeDocument } from "@/types/employee";
import { useToast } from "@/components/ui/use-toast";
import DocumentsList from "./document/DocumentsList";
import DocumentViewDialog from "./document/DocumentViewDialog";
import DocumentUploadForm from "./document/DocumentUploadForm";
import EmptyDocumentState from "./document/EmptyDocumentState";
import { UserIcon, FileText, Shield, Clipboard, FileCheck } from "lucide-react";
import { useEmployeeDocuments } from "@/hooks/employed/useEmployeeDocuments";

interface EmployeeDocumentsProps {
  employeeId: string;
  documents?: EmployeeDocument[];
  onDocumentAdded?: (newDoc: EmployeeDocument) => void;
  onDocumentDeleted?: (documentId: string) => void;
  readOnly?: boolean;
}

const EmployeeDocuments = ({ 
  employeeId, 
  documents = [], 
  onDocumentAdded, 
  onDocumentDeleted,
  readOnly = false
}: EmployeeDocumentsProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewingDocument, setViewingDocument] = useState<EmployeeDocument | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState<any>(null);
  const { toast } = useToast();
  
  const { uploadDocument, deleteDocument } = useEmployeeDocuments(employeeId);
  
  const handleViewDocument = (document: EmployeeDocument) => {
    setViewingDocument(document);
  };
  
  const handleCloseDocumentView = () => {
    setViewingDocument(null);
  };
  
  const handleOpenUploadDialog = () => {
    setNewDocument(null);
    setIsUploadDialogOpen(true);
  };
  
  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };
  
  const handleDocumentUpload = async (documentData: any) => {
    try {
      const newDoc = await uploadDocument(documentData);
      if (onDocumentAdded) onDocumentAdded(newDoc);
      
      toast({
        title: "Document Uploaded",
        description: "Document has been uploaded successfully"
      });
      
      setIsUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDocumentDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      if (onDocumentDeleted) onDocumentDeleted(documentId);
      
      toast({
        title: "Document Deleted",
        description: "Document has been deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-between">
            <div className="flex-grow">
              <TabsTrigger value="all" className="w-full sm:w-auto">All Documents</TabsTrigger>
              <TabsTrigger value="id" className="w-full sm:w-auto">
                <UserIcon className="mr-2 h-4 w-4" />
                ID
              </TabsTrigger>
              <TabsTrigger value="resume" className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </TabsTrigger>
              <TabsTrigger value="certificate" className="w-full sm:w-auto">
                <Shield className="mr-2 h-4 w-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="contract" className="w-full sm:w-auto">
                <Clipboard className="mr-2 h-4 w-4" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="other" className="w-full sm:w-auto">
                <FileCheck className="mr-2 h-4 w-4" />
                Other
              </TabsTrigger>
            </div>
            {!readOnly && (
              <Button size="sm" onClick={handleOpenUploadDialog}>
                Upload Document
              </Button>
            )}
          </TabsList>
          <TabContent value="all" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
          <TabContent value="id" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
          <TabContent value="resume" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
          <TabContent value="certificate" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
          <TabContent value="contract" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
          <TabContent value="other" documents={documents} activeTab={activeTab} handleViewDocument={handleViewDocument} handleDocumentDelete={handleDocumentDelete} />
        </Tabs>
        
        {documents.length === 0 && (
          <EmptyDocumentState />
        )}
      </CardContent>
      
      <DocumentViewDialog 
        open={!!viewingDocument}
        onOpenChange={handleCloseDocumentView}
        document={viewingDocument}
      />
      
      <Dialog open={isUploadDialogOpen} onOpenChange={handleCloseUploadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
          </DialogHeader>
          <DocumentUploadForm 
            onDocumentUpload={handleDocumentUpload} 
            onCancel={handleCloseUploadDialog} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const TabContent = ({ value, documents, activeTab, handleViewDocument, handleDocumentDelete }: {
  value: string;
  documents: EmployeeDocument[];
  activeTab: string;
  handleViewDocument: (document: EmployeeDocument) => void;
  handleDocumentDelete: (documentId: string) => void;
}) => {
  const filteredDocuments = value === 'all' ? documents : documents.filter(doc => doc.type === value);
  
  return (
    <TabsContent value={value} className="mt-2">
      {filteredDocuments.length > 0 ? (
        <DocumentsList 
          documents={filteredDocuments}
          onViewDocument={handleViewDocument}
          onDeleteDocument={handleDocumentDelete}
        />
      ) : (
        activeTab === value && <p className="text-sm text-muted-foreground">No documents of this type.</p>
      )}
    </TabsContent>
  );
};

export default EmployeeDocuments;
