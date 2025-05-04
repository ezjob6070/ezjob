
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Calendar, Award, School, FileText, Star, Plus, FileBadge, Upload, DollarSign, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Employee, EmployeeNote, SALARY_BASIS } from "@/types/employee";
import { initialEmployees } from "@/data/employees";
import EmployeeDocuments from "@/components/employed/EmployeeDocuments";
import SalaryHistoryComponent from "@/components/employed/SalaryHistory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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
      if (!foundEmployee.salaryHistory) {
        foundEmployee.salaryHistory = [];
      }
      setEmployee(foundEmployee);
    }
  }, [id]);
  
  const handleAddNote = () => {
    if (!newNote.trim() || !employee) return;
    
    const note: EmployeeNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      date: new Date().toISOString(),
      author: "Current User", // In a real app, get from auth context
      createdAt: new Date().toISOString(),
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && employee) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && employee) {
          const updatedEmployee = {
            ...employee,
            profileImage: event.target.result as string
          };
          setEmployee(updatedEmployee);
        }
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image Updated",
        description: "Profile image has been updated successfully",
      });
    }
  };

  const removeImage = () => {
    if (employee) {
      const updatedEmployee = {
        ...employee,
        profileImage: undefined
      };
      setEmployee(updatedEmployee);
      setImageFile(null);
      
      toast({
        title: "Image Removed",
        description: "Profile image has been removed",
      });
    }
  };
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>Employee not found</p>
      </div>
    );
  }

  // Format salary based on basis
  const formatSalary = () => {
    if (!employee.salaryBasis || employee.salaryBasis === SALARY_BASIS.YEARLY) {
      return `$${employee.salary.toLocaleString()}/year`;
    } else if (employee.salaryBasis === SALARY_BASIS.MONTHLY) {
      return `$${employee.salary.toLocaleString()}/month`;
    } else {
      return `$${employee.salary.toLocaleString()}/week`;
    }
  };
  
  // Generate initials if not provided
  const initials = employee.initials || employee.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  // Format date safely to prevent invalid date errors
  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return "Not available";
    
    try {
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (!isValid(date)) {
        return "Not available";
      }
      
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateStr, error);
      return "Not available";
    }
  };
  
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
                <div className="relative mb-4">
                  {employee.profileImage ? (
                    <Avatar className="h-32 w-32 border-4 border-background">
                      <AvatarImage 
                        src={employee.profileImage} 
                        alt={employee.name} 
                        className="h-32 w-32 rounded-full object-cover"
                      />
                      <AvatarFallback className="text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-32 w-32 border-4 border-background">
                      <AvatarFallback className="text-xl bg-slate-200 text-slate-500">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="mt-2 flex justify-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('profile-upload')?.click()}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      {employee.profileImage ? "Change" : "Upload"}
                    </Button>
                    {employee.profileImage && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
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
                    <span className="text-sm">{employee.address || employee.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                Employee ID
              </CardTitle>
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
                  <span className="text-sm font-medium">{formatDateSafe(employee.dateHired || employee.hireDate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground">Salary:</span>
                  <span className="text-sm font-medium">
                    {formatSalary()}
                    {employee.taxPercentage ? ` (${employee.taxPercentage}% tax)` : ''}
                  </span>
                </div>
                {employee.dateOfBirth && (
                  <>
                    <Separator />
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Birth Date:</span>
                      <span className="text-sm font-medium">
                        {formatDateSafe(employee.dateOfBirth)}
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
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="salary" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Salary
              </TabsTrigger>
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
                    <div>
                      {employee.emergencyContact && (
                        <>
                          <span>{employee.emergencyContact.name}</span>
                          <span> ({employee.emergencyContact.relationship || employee.emergencyContact.relation || 'Contact'}): </span>
                          <span>{employee.emergencyContact.phone}</span>
                        </>
                      )}
                    </div>
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
                    {employee.skills && employee.skills.length > 0 ? (
                      employee.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills recorded.</p>
                    )}
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
                  {employee.education && Array.isArray(employee.education) && employee.education.length > 0 ? (
                    <div className="space-y-4">
                      {employee.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-1">
                          <p className="text-sm">{edu}</p>
                        </div>
                      ))}
                    </div>
                  ) : employee.education && typeof employee.education === 'string' ? (
                    <div className="border-l-2 border-primary pl-4 py-1">
                      <p className="text-sm">{employee.education}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No education records available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              <EmployeeDocuments 
                employeeId={employee.id}
                documents={employee.documents}
                onUpdateEmployee={(updatedDocuments) => {
                  const updatedEmployee = {
                    ...employee,
                    documents: updatedDocuments
                  };
                  setEmployee(updatedEmployee);
                }}
              />
            </TabsContent>

            <TabsContent value="salary" className="space-y-6">
              <SalaryHistoryComponent 
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
                            <span>By: {note.createdBy || note.author || 'Unknown'}</span>
                            <span>
                              {formatDateSafe(note.createdAt || note.date)}
                            </span>
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
