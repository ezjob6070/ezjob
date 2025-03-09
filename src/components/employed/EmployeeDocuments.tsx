
import { useState } from "react";
import { format } from "date-fns";
import { FileText, Upload, Eye, Trash2, Calendar } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeDocument, DocumentType, Employee } from "@/types/employee";

interface EmployeeDocumentsProps {
  employee: Employee;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
}

const EmployeeDocuments = ({ employee, onUpdateEmployee }: EmployeeDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<EmployeeDocument[]>(employee.documents || []);
  const [selectedDocument, setSelectedDocument] = useState<EmployeeDocument | null>(null);
  const [showAddDocumentDialog, setShowAddDocumentDialog] = useState(false);
  const [showViewDocumentDialog, setShowViewDocumentDialog] = useState(false);
  
  const [newDocument, setNewDocument] = useState({
    type: DocumentType.ID,
    name: "",
    notes: "",
    expiryDate: "",
  });
  
  const getDocumentTypeLabel = (type: DocumentType) => {
    switch (type) {
      case DocumentType.ID: return "ID Card";
      case DocumentType.PASSPORT: return "Passport";
      case DocumentType.DRIVERS_LICENSE: return "Driver's License";
      case DocumentType.WORK_PERMIT: return "Work Permit";
      case DocumentType.OTHER: return "Other";
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // Here we just simulate it with a local URL
      const documentUrl = URL.createObjectURL(file);
      
      const newDocumentObj: EmployeeDocument = {
        id: `doc-${Date.now()}`,
        type: newDocument.type,
        name: newDocument.name || file.name,
        url: documentUrl,
        dateUploaded: new Date(),
        notes: newDocument.notes || undefined,
        expiryDate: newDocument.expiryDate ? new Date(newDocument.expiryDate) : undefined,
      };
      
      const updatedDocuments = [...documents, newDocumentObj];
      setDocuments(updatedDocuments);
      
      // Update the employee object
      const updatedEmployee = {
        ...employee,
        documents: updatedDocuments,
      };
      
      onUpdateEmployee(updatedEmployee);
      
      // Reset form and close dialog
      setNewDocument({
        type: DocumentType.ID,
        name: "",
        notes: "",
        expiryDate: "",
      });
      
      setShowAddDocumentDialog(false);
      
      toast({
        title: "Document Uploaded",
        description: "The document has been added to the employee's records",
      });
    }
  };
  
  const handleViewDocument = (document: EmployeeDocument) => {
    setSelectedDocument(document);
    setShowViewDocumentDialog(true);
  };
  
  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    
    // Update the employee object
    const updatedEmployee = {
      ...employee,
      documents: updatedDocuments,
    };
    
    onUpdateEmployee(updatedEmployee);
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the employee's records",
    });
    
    // Close the view dialog if open
    if (showViewDocumentDialog && selectedDocument?.id === documentId) {
      setShowViewDocumentDialog(false);
    }
  };
  
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
              <div className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select 
                      value={newDocument.type} 
                      onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value as DocumentType }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DocumentType.ID}>ID Card</SelectItem>
                        <SelectItem value={DocumentType.PASSPORT}>Passport</SelectItem>
                        <SelectItem value={DocumentType.DRIVERS_LICENSE}>Driver's License</SelectItem>
                        <SelectItem value={DocumentType.WORK_PERMIT}>Work Permit</SelectItem>
                        <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="documentName">Document Name</Label>
                    <Input
                      id="documentName"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="E.g., National ID Card"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newDocument.expiryDate}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newDocument.notes}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information about this document"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="documentFile">Upload File</Label>
                    <Input
                      id="documentFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, JPG, PNG
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDocumentDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((document) => (
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
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload employee documents like ID, passport, or work permits
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Document Viewer Dialog */}
      <Dialog open={showViewDocumentDialog} onOpenChange={setShowViewDocumentDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedDocument && (
              <>
                <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                  <div>Type: {getDocumentTypeLabel(selectedDocument.type)}</div>
                  <div>Uploaded: {format(selectedDocument.dateUploaded, "MMM d, yyyy")}</div>
                </div>
                
                <div className="max-h-[60vh] overflow-auto border rounded-md p-2">
                  {/* Document preview - would be an iframe for PDFs or img for images */}
                  <img 
                    src={selectedDocument.url} 
                    alt={selectedDocument.name}
                    className="w-full object-contain"
                  />
                </div>
                
                {selectedDocument.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Notes:</h4>
                    <p className="text-sm">{selectedDocument.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => selectedDocument && handleDeleteDocument(selectedDocument.id)}
            >
              Delete Document
            </Button>
            <Button onClick={() => setShowViewDocumentDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDocuments;
