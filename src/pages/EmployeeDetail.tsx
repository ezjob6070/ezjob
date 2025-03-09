import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Award, School, FileText, Star, Plus, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Employee, EmployeeNote } from "@/types/employee";
import { initialEmployees } from "@/data/employees";
import EmployeeDocuments from "@/components/employed/EmployeeDocuments";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  
  useEffect(() => {
    // In a real app, fetch employee data from API
    const foundEmployee = initialEmployees.find(emp => emp.id === id);
    if (foundEmployee) {
      // Initialize notes and documents arrays if they don't exist
      if (!foundEmployee.notes) {
        foundEmployee.notes = [];
      }
      if (!foundEmployee.documents) {
        foundEmployee.documents = [];
      }
      setEmployee(foundEmployee);
    }
  }, [id]);
  
  const handleAddNote = () => {
    if (!newNote.trim() || !employee) return;
    
    const note: EmployeeNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date(),
      createdBy: "Current User" // In a real app, get from auth context
    };
    
    // Create a new employee object with the updated notes
    const updatedEmployee = {
      ...employee,
      notes: [...(employee.notes || []), note]
    };
    
    setEmployee(updatedEmployee);
    setNewNote("");
    
    toast({
      title: "Note Added",
      description: "Employee note has been added successfully",
    });
  };
  
  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployee(updatedEmployee);
  };
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>Employee not found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/employed")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Employee Details
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                  {employee.profileImage ? (
                    <img 
                      src={employee.profileImage} 
                      alt={employee.name} 
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-500" />
                  )}
                </div>
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{employee.position}</p>
                <Badge className="mb-4">{employee.status}</Badge>
                
                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span className="text-sm">{employee.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Employee ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono bg-muted p-2 rounded">{employee.id}</div>
              <div className="mt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm font-medium">{employee.department}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Hired:</span>
                  <span className="text-sm font-medium">{format(employee.dateHired, "MMM d, yyyy")}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Salary:</span>
                  <span className="text-sm font-medium">${employee.salary.toLocaleString()}</span>
                </div>
                {employee.dateOfBirth && (
                  <>
                    <Separator />
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Birth Date:</span>
                      <span className="text-sm font-medium">
                        {format(employee.dateOfBirth, "MMM d, yyyy")}
                      </span>
                    </div>
                  </>
                )}
                {employee.reportsTo && (
                  <>
                    <Separator />
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Reports To:</span>
                      <span className="text-sm font-medium">
                        {initialEmployees.find(e => e.id === employee.reportsTo)?.name || employee.reportsTo}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="background" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="background" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Professional Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{employee.background || "No background information available."}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employee.certifications && employee.certifications.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {employee.certifications.map((cert, index) => (
                        <li key={index} className="text-sm">{cert}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications recorded.</p>
                  )}
                </CardContent>
              </Card>
              
              {employee.emergencyContact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{employee.emergencyContact}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  
                  {employee.performanceRating && (
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Performance Rating</div>
                      <div className="flex items-center">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-5 w-5 ${
                                index < employee.performanceRating! 
                                  ? "text-yellow-500 fill-yellow-500" 
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">{employee.performanceRating}/5</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employee.education && employee.education.length > 0 ? (
                    <div className="space-y-4">
                      {employee.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-1">
                          <p className="text-sm">{edu}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No education records available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              <EmployeeDocuments 
                employee={employee}
                onUpdateEmployee={handleUpdateEmployee}
              />
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter a note about this employee..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="h-24"
                    />
                    <Button onClick={handleAddNote}>Add Note</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {employee.notes && employee.notes.length > 0 ? (
                    <div className="space-y-4">
                      {employee.notes.map((note) => (
                        <div key={note.id} className="bg-muted p-4 rounded-md">
                          <p className="text-sm mb-2">{note.content}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>By: {note.createdBy}</span>
                            <span>{format(note.createdAt, "MMM d, yyyy h:mm a")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes have been added yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
