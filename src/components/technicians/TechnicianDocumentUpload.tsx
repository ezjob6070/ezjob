
import { useState } from "react";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Upload, Download, Trash2, Plus, Save, Shield, Eye, EyeOff, AlertCircle, CreditCard } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TechnicianDocumentUploadProps {
  technician: Technician;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded: Date;
  url: string;
}

const TechnicianDocumentUpload: React.FC<TechnicianDocumentUploadProps> = ({ technician }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    // Sample documents for UI demo - would be empty in real app
    {
      id: "doc1",
      name: "Employment Agreement.pdf",
      type: "application/pdf",
      size: 245000,
      uploaded: new Date(2023, 5, 12),
      url: "#"
    },
    {
      id: "doc2",
      name: "Contractor Terms.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 125000,
      uploaded: new Date(2023, 6, 3),
      url: "#"
    }
  ]);
  
  const [technicianNotes, setTechnicianNotes] = useState<string>(technician.notes || "");
  const [activeTab, setActiveTab] = useState<string>("documents");
  
  // State for sensitive information visibility toggles
  const [showSSN, setShowSSN] = useState(false);
  const [showDriverLicense, setShowDriverLicense] = useState(false);
  const [showIDNumber, setShowIDNumber] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to a server/storage
    // Here we're just simulating the addition to the documents list
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploaded: new Date(),
      url: "#" // Would be a real URL in production
    }));
    
    setDocuments([...documents, ...newDocuments]);
    
    toast({
      title: "Documents Uploaded",
      description: `Successfully uploaded ${files.length} document(s)`,
    });
    
    // Reset file input
    e.target.value = '';
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    toast({
      title: "Document Deleted",
      description: "The document has been removed",
    });
  };

  const handleSaveNotes = () => {
    // In a real app, this would save to a server
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

          {documents.length === 0 ? (
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
              {documents.map(doc => (
                <Card key={doc.id} className="p-4 flex items-center gap-4">
                  {getDocumentIcon(doc.type)}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doc.name}</h4>
                    <div className="flex text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.size)}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {doc.uploaded.toLocaleDateString(undefined, {
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
                          {maskData(technician.driverLicense.number, showDriverLicense)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">State</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                          {showDriverLicense ? technician.driverLicense.state : "••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expiration</p>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                          {showDriverLicense ? technician.driverLicense.expirationDate : "••/••/••••"}
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
                <p>This information is sensitive and should be handled according to data privacy regulations. Ensure you have appropriate authorization to view this data.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianDocumentUpload;
