import { useState } from "react";
import { Technician, Document } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Trash2, Plus, Save, Shield, Eye, EyeOff, AlertCircle, CreditCard, FileUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

interface TechnicianDocumentUploadProps {
  technician: Technician;
}

const TechnicianDocumentUpload: React.FC<TechnicianDocumentUploadProps> = ({ technician }) => {
  const { toast } = useToast();
  const { updateTechnician } = useGlobalState();
  const [documents, setDocuments] = useState<Document[]>(technician.documents || []);
  const [technicianNotes, setTechnicianNotes] = useState<string>(technician.notes || "");
  const [activeTab, setActiveTab] = useState<string>("documents");
  
  // State for sensitive information visibility toggles
  const [showSSN, setShowSSN] = useState(false);
  const [showDriverLicense, setShowDriverLicense] = useState(false);
  const [showIDNumber, setShowIDNumber] = useState(false);
  
  // State for document upload
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("id");
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a server/storage
    // Here we're just simulating the addition to the documents list
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      title: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: "#" // Would be a real URL in production
    }));
    
    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    
    // Update technician with new documents
    const updatedTechnician = {
      ...technician,
      documents: updatedDocuments
    };
    updateTechnician(technician.id, updatedTechnician);
    
    toast({
      title: "Documents Uploaded",
      description: `Successfully uploaded ${files.length} document(s)`,
    });
    
    // Reset file input
    e.target.value = '';
  };

  const handleSensitiveDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingDocument(true);
    
    // Simulate upload processing
    setTimeout(() => {
      const newDocument: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        title: documentTitle || file.name,
        type: documentType,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file) // Would be a real URL in production
      };
      
      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      
      // Update technician with new documents
      const updatedTechnician = {
        ...technician,
        documents: updatedDocuments
      };
      updateTechnician(technician.id, updatedTechnician);
      
      // Reset form
      setDocumentTitle("");
      setUploadingDocument(false);
      
      toast({
        title: "Sensitive Document Uploaded",
        description: `Successfully uploaded ${documentType.toUpperCase()} document`,
      });
      
      // Reset file input
      e.target.value = '';
    }, 1000);
  };

  const handleDelete = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    
    // Update technician with filtered documents
    const updatedTechnician = {
      ...technician,
      documents: updatedDocuments
    };
    updateTechnician(technician.id, updatedTechnician);
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed",
    });
  };

  const handleSaveNotes = () => {
    // Update technician with new notes
    updateTechnician(technician.id, {
      ...technician,
      notes: technicianNotes
    });
    
    toast({
      title: "Notes Saved",
      description: "Technician notes have been updated",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('word') || type.includes('doc')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (type.includes('image')) return <FileText className="h-8 w-8 text-green-500" />;
    if (type === 'id') return <FileText className="h-8 w-8 text-amber-500" />;
    if (type === 'contract') return <FileText className="h-8 w-8 text-purple-500" />;
    if (type === 'ssn') return <FileText className="h-8 w-8 text-red-600" />;
    if (type === 'license') return <FileText className="h-8 w-8 text-blue-600" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };
  
  // Helper function to mask sensitive data
  const maskData = (data: string | undefined, showFull: boolean) => {
    if (!data) return "Not provided";
    if (showFull) return data;
    return data.substring(0, 3) + "•".repeat(data.length - 3);
  };

  // Toggle visibility and show toast notification for security awareness
  const toggleSensitiveData = (dataType: 'ssn' | 'license' | 'id') => {
    if (dataType === 'ssn') {
      setShowSSN(!showSSN);
      if (!showSSN) {
        toast({
          title: "Sensitive Data Revealed",
          description: "Social Security Number is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    } else if (dataType === 'license') {
      setShowDriverLicense(!showDriverLicense);
      if (!showDriverLicense) {
        toast({
          title: "Sensitive Data Revealed",
          description: "Driver's License information is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    } else if (dataType === 'id') {
      setShowIDNumber(!showIDNumber);
      if (!showIDNumber) {
        toast({
          title: "Sensitive Data Revealed",
          description: "ID information is now visible. Remember to protect this information.",
          variant: "destructive",
        });
      }
    }
  };

  // Get sensitive document type display name
  const getDocumentTypeName = (type: string): string => {
    switch(type) {
      case 'id': return 'ID Document';
      case 'ssn': return 'Social Security Card';
      case 'license': return 'Driver License';
      case 'contract': return 'Work Contract';
      case 'passport': return 'Passport';
      case 'visa': return 'Visa/Work Permit';
      case 'other': return 'Other Document';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Filter documents by type
  const sensitiveDocuments = documents.filter(doc => 
    ['id', 'ssn', 'license', 'contract', 'passport', 'visa'].includes(doc.type)
  );
  
  const otherDocuments = documents.filter(doc => 
    !['id', 'ssn', 'license', 'contract', 'passport', 'visa'].includes(doc.type)
  );
  
  // Helper function to safely access driver's license properties
  const getLicenseProperty = (property: 'number' | 'state' | 'expirationDate'): string => {
    if (!technician.driverLicense) return "Not provided";
    
    if (typeof technician.driverLicense === 'string') {
      return technician.driverLicense;
    }
    
    return technician.driverLicense[property] || "Not provided";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Documents & Notes</h3>
          <p className="text-sm text-muted-foreground">
            Manage documents and notes for this technician
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="sensitive">Sensitive Information</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-end">
            <div className="relative">
              <input
                type="file"
                id="document-upload"
                className="sr-only"
                onChange={handleFileUpload}
                multiple
              />
              <label htmlFor="document-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {otherDocuments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No documents yet</h3>
              <p className="text-muted-foreground mt-2">
                Upload employment agreements, certifications, or other documents
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </label>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {otherDocuments.map(doc => (
                <Card key={doc.id} className="p-4 flex items-center gap-4">
                  {getDocumentIcon(doc.type)}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.title}</h4>
                    <div className="flex text-xs text-muted-foreground">
                      <span>{doc.size ? formatFileSize(doc.size) : 'Unknown size'}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(doc.uploadDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="technician-notes">Notes</Label>
              <Textarea 
                id="technician-notes" 
                placeholder="Add notes about this technician..." 
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                className="h-60"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes}>
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Sensitive Information Tab */}
        <TabsContent value="sensitive" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2 text-amber-500" />
              <h3 className="text-base font-semibold">Sensitive Information</h3>
            </div>
            
            {/* Upload Sensitive Document Section */}
            <Card className="p-4 mb-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Upload Sensitive Document</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="document-title" className="text-xs">Document Title</Label>
                    <Input 
                      id="document-title" 
                      placeholder="Enter document title" 
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="document-type" className="text-xs">Document Type</Label>
                    <Select 
                      value={documentType} 
                      onValueChange={setDocumentType}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">ID Document</SelectItem>
                        <SelectItem value="ssn">Social Security Card</SelectItem>
                        <SelectItem value="license">Driver License</SelectItem>
                        <SelectItem value="contract">Work Contract</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="visa">Visa/Work Permit</SelectItem>
                        <SelectItem value="other">Other Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="sensitive-document-upload"
                    className="sr-only"
                    onChange={handleSensitiveDocumentUpload}
                  />
                  <label htmlFor="sensitive-document-upload" className="w-full">
                    <Button 
                      variant="secondary" 
                      className="w-full cursor-pointer" 
                      disabled={uploadingDocument}
                      asChild
                    >
                      <span>
                        <FileUp className="h-4 w-4 mr-2" />
                        {uploadingDocument ? "Uploading..." : "Upload Document"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </Card>
            
            {/* Sensitive Document List */}
            {sensitiveDocuments.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Uploaded Sensitive Documents</h4>
                <div className="space-y-2">
                  {sensitiveDocuments.map(doc => (
                    <Card key={doc.id} className="p-3 flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                        <div className="flex text-xs text-muted-foreground">
                          <span>{getDocumentTypeName(doc.type)}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-amber-50 p-5 rounded-lg space-y-6">
              {/* Social Security Number */}
              <div className="p-3 bg-white border rounded-md shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-amber-600" />
                    Social Security Number
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => toggleSensitiveData('ssn')}
                  >
                    {showSSN ? 
                      <span className="flex items-center"><EyeOff className="h-4 w-4 mr-1" /> Hide</span> : 
                      <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> View</span>}
                  </Button>
                </div>
                <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                  {maskData(technician.ssn, showSSN)}
                </p>
              </div>
              
              {/* Driver's License */}
              <div className="p-3 bg-white border rounded-md shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-amber-600" />
                    Driver's License
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => toggleSensitiveData('license')}
                  >
                    {showDriverLicense ? 
                      <span className="flex items-center"><EyeOff className="h-4 w-4 mr-1" /> Hide</span> : 
                      <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> View</span>}
                  </Button>
                </div>
                
                {technician.driverLicense ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Number</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                          {maskData(getLicenseProperty('number'), showDriverLicense)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">State</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                          {showDriverLicense ? getLicenseProperty('state') : "••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expiration</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                          {showDriverLicense ? getLicenseProperty('expirationDate') : "••/••/••••"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded border">Not provided</p>
                )}
              </div>
              
              {/* ID Number */}
              <div className="p-3 bg-white border rounded-md shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-amber-600" />
                    ID Number
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => toggleSensitiveData('id')}
                  >
                    {showIDNumber ? 
                      <span className="flex items-center"><EyeOff className="h-4 w-4 mr-1" /> Hide</span> : 
                      <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> View</span>}
                  </Button>
                </div>
                <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                  {maskData(technician.idNumber, showIDNumber)}
                </p>
              </div>
              
              <div className="flex items-center text-xs text-amber-700 mt-4 bg-amber-100 p-2 rounded-md">
                <AlertCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                <p>This information is sensitive and should be handled according to data privacy regulations. Upload any required documentation using the form above.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianDocumentUpload;
