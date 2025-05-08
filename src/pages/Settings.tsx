import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CompanyProfile, User, UserPermission, UserRole, PermissionModule, PermissionAction } from "@/types/finance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Filter, Key, Lock, MoreHorizontal, Plus, Search, ShieldCheck, User as UserIcon, UserCog, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const companyProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, {
      message: "Company name must be at least 2 characters.",
    })
    .max(50, {
      message: "Company name must not be longer than 50 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  address: z.string().max(200).optional(),
  industry: z.string().max(50).optional(),
  taxId: z.string().max(30).optional(),
  description: z.string().max(500).optional(),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  taskReminders: z.boolean().default(true),
  meetingReminders: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
});

// Add user form schema
const userFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["admin", "manager", "staff", "viewer"]),
  status: z.enum(["active", "inactive", "pending"]),
});

type CompanyProfileValues = z.infer<typeof companyProfileSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

// Define available permission modules and actions for the UI
const permissionModules: { id: PermissionModule; name: string; description: string; }[] = [
  { id: "jobs", name: "Jobs", description: "Access to jobs and related features" },
  { id: "technicians", name: "Technicians", description: "Access to technician information" },
  { id: "clients", name: "Clients", description: "Access to client information" },
  { id: "finance", name: "Finance", description: "Access to financial information" },
  { id: "settings", name: "Settings", description: "Access to system settings" },
  { id: "reports", name: "Reports", description: "Access to analytics and reports" },
  { id: "team", name: "Team Management", description: "Access to manage team members" },
  { id: "payments", name: "Payments", description: "Access to payment processing" },
  { id: "estimates", name: "Estimates", description: "Access to create and manage estimates" },
  { id: "invoices", name: "Invoices", description: "Access to create and manage invoices" },
];

// Permission actions with descriptions
const permissionActions: { id: PermissionAction; name: string; description: string; }[] = [
  { id: "view", name: "View", description: "Can view information" },
  { id: "create", name: "Create", description: "Can create new items" },
  { id: "edit", name: "Edit", description: "Can modify existing items" },
  { id: "delete", name: "Delete", description: "Can delete items" },
  { id: "approve", name: "Approve", description: "Can approve items requiring authorization" },
  { id: "manage", name: "Manage", description: "Full management capability" },
  { id: "export", name: "Export", description: "Can export data" },
  { id: "import", name: "Import", description: "Can import data" },
  { id: "viewSensitive", name: "View Sensitive", description: "Can view sensitive/confidential information" },
];

// Generate all available permissions based on modules and actions
const generateAvailablePermissions = (): UserPermission[] => {
  const permissions: UserPermission[] = [];
  
  permissionModules.forEach(module => {
    permissionActions.forEach(action => {
      // Skip combinations that don't make sense
      if ((module.id === "settings" && action.id !== "view" && action.id !== "manage") ||
          (action.id === "viewSensitive" && !["finance", "clients", "team", "payments"].includes(module.id))) {
        return;
      }
      
      permissions.push({
        id: `${module.id}-${action.id}`,
        name: `${action.name} ${module.name}`,
        description: `Can ${action.name.toLowerCase()} ${module.name.toLowerCase()}`,
        module: module.id,
        action: action.id
      });
    });
  });
  
  return permissions;
};

// Sample users for demonstration
const initialUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "admin",
    status: "active",
    permissions: generateAvailablePermissions(),
    createdAt: new Date(2023, 5, 15),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "manager",
    status: "active",
    permissions: generateAvailablePermissions().filter(p => p.action === "view" || p.module === "jobs"),
    createdAt: new Date(2023, 8, 10),
    lastLogin: new Date(2023, 11, 20),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "staff",
    status: "inactive",
    permissions: generateAvailablePermissions().filter(p => p.action === "view"),
    createdAt: new Date(2023, 10, 5),
    lastLogin: new Date(2023, 10, 15),
  },
  {
    id: "4",
    name: "Jessica Davis",
    email: "jessica.davis@example.com",
    role: "viewer",
    status: "pending",
    permissions: generateAvailablePermissions().filter(p => p.action === "view" && p.module !== "settings"),
    createdAt: new Date(2024, 1, 20),
    lastLogin: null,
  },
];

// Role display mapping
const roleDisplay: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-red-100 text-red-800" },
  manager: { label: "Manager", color: "bg-blue-100 text-blue-800" },
  staff: { label: "Staff", color: "bg-green-100 text-green-800" },
  viewer: { label: "Viewer", color: "bg-gray-100 text-gray-800" },
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditPermissionsDialog, setShowEditPermissionsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPermissionModule, setSelectedPermissionModule] = useState<PermissionModule | "all">("all");
  const [showPermissionDetails, setShowPermissionDetails] = useState(false);
  
  const availablePermissions = generateAvailablePermissions();

  const companyProfileForm = useForm<CompanyProfileValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      companyName: "TechService Solutions",
      email: "info@techservicesolutions.com",
      phone: "(555) 123-4567",
      website: "https://techservicesolutions.com",
      address: "123 Business Ave, Suite 100, Tech City, TC 12345",
      industry: "Field Service Management",
      taxId: "12-3456789",
      description: "Premier provider of field service management solutions with over 10 years of experience serving residential and commercial clients.",
    },
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      meetingReminders: true,
      weeklyDigest: true,
    },
  });
  
  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "staff",
      status: "active",
    },
  });

  function onCompanyProfileSubmit(data: CompanyProfileValues) {
    toast.success("Company profile updated", {
      description: "Your company information has been updated successfully.",
    });
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast.success("Notification preferences updated", {
      description: "Your notification preferences have been saved.",
    });
  }
  
  function onAddUserSubmit(data: UserFormValues) {
    // Assign default permissions based on role
    let defaultPermissions: UserPermission[] = [];
    
    switch(data.role) {
      case "admin":
        defaultPermissions = availablePermissions;
        break;
      case "manager":
        defaultPermissions = availablePermissions.filter(p => 
          p.module !== "settings" || p.action !== "manage");
        break;
      case "staff":
        defaultPermissions = availablePermissions.filter(p => 
          p.action === "view" || 
          (p.module === "jobs" && ["create", "edit"].includes(p.action)));
        break;
      case "viewer":
        defaultPermissions = availablePermissions.filter(p => 
          p.action === "view" && 
          !["settings", "finance"].includes(p.module));
        break;
    }

    const newUser: User = {
      id: `${users.length + 1}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      permissions: defaultPermissions,
      createdAt: new Date(),
    };
    
    setUsers([...users, newUser]);
    setShowAddUserDialog(false);
    toast.success("User added", {
      description: `${data.name} has been added as a ${data.role}.`,
    });
    userForm.reset();
  }

  function handleEditPermissions(user: User) {
    setSelectedUser(user);
    setShowEditPermissionsDialog(true);
    setSelectedPermissionModule("all");
  }
  
  function handleUpdatePermissions(userId: string, permissionId: string, isChecked: boolean) {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          if (isChecked) {
            const permissionToAdd = availablePermissions.find(p => p.id === permissionId);
            if (permissionToAdd && !user.permissions.some(p => p.id === permissionId)) {
              return {
                ...user,
                permissions: [...user.permissions, permissionToAdd]
              };
            }
          } else {
            return {
              ...user,
              permissions: user.permissions.filter(p => p.id !== permissionId)
            };
          }
        }
        return user;
      })
    );
  }

  function handleUpdateUserRole(userId: string, role: UserRole) {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          // Update permissions based on new role
          let newPermissions: UserPermission[];
          
          switch(role) {
            case "admin":
              newPermissions = availablePermissions;
              break;
            case "manager":
              newPermissions = availablePermissions.filter(p => 
                p.module !== "settings" || p.action !== "manage");
              break;
            case "staff":
              newPermissions = availablePermissions.filter(p => 
                p.action === "view" || 
                (p.module === "jobs" && ["create", "edit"].includes(p.action)));
              break;
            case "viewer":
              newPermissions = availablePermissions.filter(p => 
                p.action === "view" && 
                !["settings", "finance"].includes(p.module));
              break;
            default:
              newPermissions = user.permissions;
          }
          
          return {
            ...user,
            role,
            permissions: newPermissions
          };
        }
        return user;
      })
    );
    
    toast.success("User role updated", {
      description: `User role has been updated to ${role}.`,
    });
  }
  
  function handleDeleteUser(userId: string) {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast.success("User removed", {
      description: "The user has been removed successfully.",
    });
  }
  
  function handleUpdateUserStatus(userId: string, status: "active" | "inactive" | "pending") {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    );
    
    toast.success("User status updated", {
      description: `User status has been updated to ${status}.`,
    });
  }
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter permissions by selected module
  const filteredPermissions = selectedPermissionModule === "all" 
    ? availablePermissions 
    : availablePermissions.filter(p => p.module === selectedPermissionModule);

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your company settings, users and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt="Company logo" />
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button size="sm" variant="outline">
                  Change Company Logo
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  Remove
                </Button>
              </div>
            </div>

            <Separator />

            <Form {...companyProfileForm}>
              <form
                onSubmit={companyProfileForm.handleSubmit(onCompanyProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={companyProfileForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyProfileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyProfileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyProfileForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyProfileForm.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyProfileForm.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / Business Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={companyProfileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter your company's address"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyProfileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description about your company"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>
                        This description may appear on invoices, estimates, and client communications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update Company Profile</Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Form {...notificationsForm}>
            <form
              onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="pushNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Push Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications on your desktop
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="taskReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Task Reminders
                        </FormLabel>
                        <FormDescription>
                          Receive reminders about upcoming tasks
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="meetingReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Meeting Reminders
                        </FormLabel>
                        <FormDescription>
                          Receive reminders about scheduled meetings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={notificationsForm.control}
                  name="weeklyDigest"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Weekly Digest
                        </FormLabel>
                        <FormDescription>
                          Receive a weekly summary of your activities
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Save preferences</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-2 w-full max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
              </div>
              
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account and assign their role and permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter email address" type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={userForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Defines base permissions level
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={userForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="p-4 border rounded-md mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Role Permission Preview</h3>
                          <Badge variant="outline" className={
                            roleDisplay[userForm.watch("role") as UserRole]?.color || "bg-gray-100"
                          }>
                            {roleDisplay[userForm.watch("role") as UserRole]?.label || "Custom"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          These permissions will be assigned to the user based on their role:
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {(() => {
                            // Get permissions based on selected role
                            const role = userForm.watch("role") as UserRole;
                            let rolePermissions: string[] = [];
                            
                            switch(role) {
                              case "admin":
                                rolePermissions = ["Full system access", "Can manage all settings", "Can manage all users"];
                                break;
                              case "manager":
                                rolePermissions = ["Can manage most features", "Limited settings access", "Can view financial data"];
                                break;
                              case "staff":
                                rolePermissions = ["Basic access to jobs", "Can create and edit jobs", "Limited financial visibility"];
                                break;
                              case "viewer":
                                rolePermissions = ["View-only access", "No edit capabilities", "No access to settings"];
                                break;
                            }
                            
                            return rolePermissions.map((perm, i) => (
                              <div key={i} className="flex items-center">
                                <Check className="h-3 w-3 text-green-500 mr-2" />
                                <span className="text-xs">{perm}</span>
                              </div>
                            ));
                          })()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          You can customize these permissions after creating the user.
                        </p>
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit">Add User</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleDisplay[user.role].color}>
                        {roleDisplay[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "success" : user.status === "pending" ? "warning" : "destructive"}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPermissions(user)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserRole(user.id, "admin")}
                            disabled={user.role === "admin"}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserRole(user.id, "manager")}
                            disabled={user.role === "manager"}
                          >
                            Set as Manager
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserRole(user.id, "staff")}
                            disabled={user.role === "staff"}
                          >
                            Set as Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateUserStatus(user.id, "active")}
                            disabled={user.status === "active"}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Set as Active
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUpdateUserStatus(user.id, "inactive")}
                            disabled={user.status === "inactive"}
                          >
                            Set as Inactive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <Dialog open={showEditPermissionsDialog} onOpenChange={setShowEditPermissionsDialog}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Manage User Permissions
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedUser && (
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{selectedUser.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={roleDisplay[selectedUser.role].color}>
                            {roleDisplay[selectedUser.role].label}
                          </Badge>
                          <Badge variant={selectedUser.status === "active" ? "success" : selectedUser.status === "pending" ? "warning" : "destructive"}>
                            {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={selectedPermissionModule === "all" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setSelectedPermissionModule("all")}
                      >
                        All
                      </Button>
                      
                      {permissionModules.map(module => (
                        <Button
                          key={module.id}
                          variant="outline"
                          size="sm"
                          className={selectedPermissionModule === module.id ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setSelectedPermissionModule(module.id)}
                        >
                          {module.name}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowPermissionDetails(!showPermissionDetails)}
                      >
                        {showPermissionDetails ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                  </div>
                  
                  {selectedUser && (
                    <div className="h-[400px] overflow-y-auto border rounded-md p-4">
                      <div className="space-y-6">
                        {/* Permissions list */}
                        <div className="grid grid-cols-1 gap-3">
                          {filteredPermissions.map((permission) => (
                            <div 
                              key={permission.id} 
                              className="flex items-center justify-between p-3 border rounded hover:bg-muted/30"
                            >
                              <div className="flex items-start">
                                <div className="flex items-center h-5 mt-0.5">
                                  <Checkbox
                                    id={`permission-${permission.id}`}
                                    checked={selectedUser.permissions.some(p => p.id === permission.id)}
                                    onCheckedChange={(checked) => 
                                      handleUpdatePermissions(selectedUser.id, permission.id, checked === true)
                                    }
                                  />
                                </div>
                                <div className="ml-3">
                                  <div className="flex items-center gap-2">
                                    <label
                                      htmlFor={`permission-${permission.id}`}
                                      className="text-sm font-medium"
                                    >
                                      {permission.name}
                                    </label>
                                    
                                    {/* Special permission indicators */}
                                    {permission.action === "viewSensitive" && (
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                        Sensitive
                                      </Badge>
                                    )}
                                    {permission.action === "manage" && (
                                      <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                                        Admin
                                      </Badge>
                                    )}
                                    {permission.module === "settings" && (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                        System
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {showPermissionDetails && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      <div className="flex items-start gap-x-2 mt-1">
                                        <div className="flex items-center">
                                          <Key className="h-3 w-3 mr-1" />
                                          <span className="font-medium">{permission.action}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Filter className="h-3 w-3 mr-1" />
                                          <span className="font-medium">{permission.module}</span>
                                        </div>
                                      </div>
                                      <p className="mt-1">{permission.description}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {selectedUser && (
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.permissions.length} permissions granted
                        </p>
                      )}
                    </div>
                    
                    <DialogFooter className="sm:justify-end">
                      <Button onClick={() => setShowEditPermissionsDialog(false)}>
                        Done
                      </Button>
                    </DialogFooter>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Appearance settings coming soon
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Danger Zone</h3>
              <p className="text-muted-foreground mt-1">
                Permanent actions that can't be undone
              </p>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  Delete All Data
                </Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
