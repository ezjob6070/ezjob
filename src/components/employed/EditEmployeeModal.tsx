
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Employee, EmployeeStatus } from "@/types/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

type EditEmployeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (updatedEmployee: Employee) => void;
  employee: Employee | null;
};

const DEPARTMENTS = [
  "Human Resources",
  "Engineering",
  "Marketing",
  "Finance",
  "Sales",
  "Customer Support",
  "Operations",
  "Research & Development",
  "Legal",
  "Executive",
];

const POSITIONS = [
  "Software Developer",
  "Marketing Specialist",
  "HR Manager",
  "Accountant",
  "Customer Service Rep",
  "Project Manager",
  "Sales Representative",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "Finance Manager",
  "Operations Coordinator",
];

const EditEmployeeModal = ({ open, onOpenChange, onUpdateEmployee, employee }: EditEmployeeModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    address: "",
    status: EmployeeStatus.ACTIVE,
    salary: 0,
    skills: [],
    performanceRating: 3,
    background: "",
    profileImage: "",
  });
  
  // For image handling
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [skillInput, setSkillInput] = useState("");

  // Update form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        position: employee.position,
        department: employee.department || "",
        address: employee.address || "",
        status: employee.status,
        salary: employee.salary,
        skills: [...(employee.skills || [])],
        performanceRating: employee.performanceRating || 3,
        background: employee.background || "",
        profileImage: employee.profileImage || "",
      });
      
      // Set preview if image exists
      if (employee.profileImage) {
        setPreviewUrl(employee.profileImage);
      } else {
        setPreviewUrl("");
      }
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create object URL for preview
      const fileUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setPreviewUrl(fileUrl);
      
      // In a real app, you would upload to server here
      // For this demo, we'll just use the URL directly
      setFormData(prev => ({ ...prev, profileImage: fileUrl }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.position) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!employee) return;

    // Generate initials if they don't exist
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // Create updated employee object
    const updatedEmployee: Employee = {
      ...employee,
      ...formData,
      salary: typeof formData.salary === 'string' 
        ? parseFloat(formData.salary) 
        : formData.salary || 0,
      profileImage: formData.profileImage || undefined,
      initials: initials,
    };

    onUpdateEmployee(updatedEmployee);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Image upload section */}
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex flex-col items-center">
              <div className="mb-3">
                {previewUrl ? (
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={previewUrl} alt={formData.name || "Profile"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                      {employee?.name?.split(" ").map(n => n[0]).join("") || ""}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                      {employee?.name?.split(" ").map(n => n[0]).join("") || ""}
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

          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">Position *</Label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>Select position</option>
                {POSITIONS.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="" disabled>Select department</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value={EmployeeStatus.ACTIVE}>Active</option>
                <option value={EmployeeStatus.PENDING}>Pending</option>
                <option value={EmployeeStatus.INACTIVE}>Inactive</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary ($) *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleNumberChange}
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="performanceRating">Performance Rating (1-5)</Label>
              <Input
                id="performanceRating"
                name="performanceRating"
                type="number"
                value={formData.performanceRating}
                onChange={handleNumberChange}
                placeholder="3"
                min="1"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid gap-2 col-span-2">
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
                <Badge key={index} className="px-3 py-1">
                  {skill}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeSkill(skill)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Remove {skill}</span>
                  </Button>
                </Badge>
              ))}
              {!formData.skills?.length && (
                <span className="text-sm text-muted-foreground">No skills added yet</span>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="background">Background & Experience</Label>
            <textarea
              id="background"
              name="background"
              value={formData.background || ""}
              onChange={handleChange}
              placeholder="Professional background and experience..."
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
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
