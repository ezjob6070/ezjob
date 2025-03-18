
import { FileText, Upload } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/employee";
import useEmployeeDocuments from "@/hooks/employed/useEmployeeDocuments";
import DocumentsList from "./document/DocumentsList";
import DocumentUploadForm from "./document/DocumentUploadForm";
import DocumentViewDialog from "./document/DocumentViewDialog";

interface EmployeeDocumentsProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

const EmployeeDocuments = ({ employee, onUpdateEmployee }: EmployeeDocumentsProps) => {
  const {
    documents,
    selectedDocument,
    showAddDocumentDialog,
    showViewDocumentDialog,
    newDocument,
    getDocumentTypeLabel,
    setShowAddDocumentDialog,
    setShowViewDocumentDialog,
    setNewDocument,
    handleFileUpload,
    handleViewDocument,
    handleDeleteDocument
  } = useEmployeeDocuments(employee, onUpdateEmployee);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Employee Documents
          </CardTitle>
          <Dialog open={showAddDocumentDialog} onOpenChange={setShowAddDocumentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <DocumentUploadForm
                newDocument={newDocument}
                setNewDocument={setNewDocument}
                onCancel={() => setShowAddDocumentDialog(false)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDocumentDialog(false)}>
                  Cancel
                </Button>
                <label htmlFor="document-file-upload">
                  <Button>Upload</Button>
                  <Input
                    id="document-file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DocumentsList
            documents={documents}
            getDocumentTypeLabel={getDocumentTypeLabel}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        </CardContent>
      </Card>
      
      <DocumentViewDialog
        open={showViewDocumentDialog}
        onOpenChange={setShowViewDocumentDialog}
        selectedDocument={selectedDocument}
        getDocumentTypeLabel={getDocumentTypeLabel}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default EmployeeDocuments;
