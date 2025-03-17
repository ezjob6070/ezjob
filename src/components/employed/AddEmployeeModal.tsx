import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Employee, EmployeeStatus, SalaryBasis } from "@/types/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

type AddEmployeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (employee: Employee) => void;
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

const AddEmployeeModal = ({ open, onOpenChange, onAddEmployee }: AddEmployeeModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    address: "",
    salary: "",
    skills: [] as string[],
    profileImage: "",
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const currentDate = new Date();
    const newEmployee: Employee = {
      id: `emp-${uuidv4().slice(0, 8)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      status: EmployeeStatus.ACTIVE,
      dateHired: currentDate.toISOString(),
      hireDate: currentDate.toISOString(),
      salary: parseFloat(formData.salary) || 50000,
      salaryBasis: SalaryBasis.YEARLY,
      address: formData.address,
      skills: formData.skills,
      performanceRating: 3,
      profileImage: formData.profileImage || undefined,
      initials,
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      rating: 4.5,
    };

    onAddEmployee(newEmployee);
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      address: "",
      salary: "",
      skills: [],
      profileImage: "",
    });
    setPreviewUrl("");
    setSelectedImage(null);
    setSkillInput("");
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label>Profile Picture</Label>
            <div className="flex flex-col items-center">
              <div className="mb-3">
                {previewUrl ? (
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={previewUrl} alt={formData.name || "Profile"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                      {formData.name ? formData.name.split(" ").map(n => n[0]).join("") : "+"}
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
                value={formData.address}
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
              <Label htmlFor="salary">Salary ($) *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                step="1000"
                required
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
              {formData.skills.map((skill, index) => (
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
              {!formData.skills.length && (
                <span className="text-sm text-muted-foreground">No skills added yet</span>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
