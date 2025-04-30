import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Employee,
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_OPTIONS,
  SALARY_BASIS,
  SALARY_BASIS_OPTIONS
} from "@/types/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type EditEmployeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (employee: Employee) => void;
  employee: Employee | null;
};

const EditEmployeeModal = ({ open, onOpenChange, onUpdateEmployee, employee }: EditEmployeeModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  const [formData, setFormData] = useState<Employee>({
    id: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    location: "",
    hireDate: "",
    status: EMPLOYEE_STATUS.ACTIVE,
    salary: 0,
    salaryBasis: SALARY_BASIS.ANNUAL,
    manager: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
    documents: [],
    notes: [],
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [certificateInput, setCertificateInput] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setPreviewUrl(employee.profileImage || "");
      
      // Initialize skills array if it doesn't exist
      if (!employee.skills) {
        setFormData(prev => ({
          ...prev,
          skills: []
        }));
      }
      
      // Initialize certifications array if it doesn't exist
      if (!employee.certifications) {
        setFormData(prev => ({
          ...prev,
          certifications: []
        }));
      }
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSalaryBasisChange = (value: string) => {
    setFormData(prev => ({ ...prev, salaryBasis: value }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      
      setSelectedImage(file);
      setPreviewUrl(fileUrl);
      setFormData(prev => ({ ...prev, profileImage: fileUrl }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && formData.skills && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (!formData.skills) return;
    
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertificate = () => {
    if (certificateInput.trim() && formData.certifications && !formData.certifications.includes(certificateInput.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certificateInput.trim()]
      }));
      setCertificateInput("");
    }
  };

  const removeCertificate = (certToRemove: string) => {
    if (!formData.certifications) return;
    
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications?.filter(cert => cert !== certToRemove)
    }));
  };

  const addNote = () => {
    if (!noteContent.trim()) return;
    
    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent,
      date: new Date().toISOString(),
      author: "Current User",
      createdAt: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    
    setNoteContent("");
  };

  const deleteNote = (noteId: string) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const date = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    onUpdateEmployee(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Project Manager"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Engineering"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salary">Salary *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleNumberChange(e, 'salary')}
                    placeholder="50000"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salaryBasis">Salary Basis *</Label>
                  <select
                    id="salaryBasis"
                    name="salaryBasis"
                    value={formData.salaryBasis}
                    onChange={(e) => handleSalaryBasisChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    {SALARY_BASIS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    {EMPLOYEE_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image-upload">Profile Picture</Label>
                  <div className="flex flex-col items-center">
                    <div className="mb-3">
                      {previewUrl ? (
                        <Avatar className="h-24 w-24 border-2 border-primary/20">
                          <AvatarImage src={previewUrl} alt={formData.name || "Profile"} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                            {formData.name ? getInitials(formData.name) : "+"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-24 w-24 border-2 border-primary/20">
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                            +
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-accent">
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </div>
                        <input 
                          id="image-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageChange}
                        />
                      </label>
                      {previewUrl && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setPreviewUrl("");
                            setSelectedImage(null);
                            setFormData(prev => ({ ...prev, profileImage: "" }));
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="skills">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      placeholder="Add a skill"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills?.map((skill, index) => (
                      <div key={index} className="flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm">
                        {skill}
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          onClick={() => removeSkill(skill)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                    {!formData.skills?.length && (
                      <span className="text-sm text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="certifications">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Certifications</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={certificateInput} 
                      onChange={(e) => setCertificateInput(e.target.value)} 
                      placeholder="Add a certification"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCertificate();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addCertificate}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.certifications?.map((cert, index) => (
                      <div key={index} className="flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">
                        {cert}
                        <button
                          type="button"
                          className="ml-2 text-green-500 hover:text-green-700"
                          onClick={() => removeCertificate(cert)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                    {!formData.certifications?.length && (
                      <span className="text-sm text-muted-foreground">No certifications added yet</span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={noteContent} 
                      onChange={(e) => setNoteContent(e.target.value)} 
                      placeholder="Add a note"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addNote();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addNote}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.notes?.map((note) => (
                      <div key={note.id} className="flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-sm">
                        {note.content}
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {!formData.notes?.length && (
                      <span className="text-sm text-muted-foreground">No notes added yet</span>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
