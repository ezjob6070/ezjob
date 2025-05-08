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
import { User, UserPermission, UserRole } from "@/types/finance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, MoreHorizontal, Plus, Search, UserCog, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  bio: z.string().max(160).optional(),
  phone: z.string().optional(),
  jobTitle: z.string().max(50).optional(),
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

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type UserFormValues = z.infer<typeof userFormSchema>;

// Sample permissions for dropdown selection
const availablePermissions: UserPermission[] = [
  { id: "1", name: "View Jobs", description: "Can view all jobs", module: "jobs", action: "view" },
  { id: "2", name: "Create Jobs", description: "Can create new jobs", module: "jobs", action: "create" },
  { id: "3", name: "Edit Jobs", description: "Can edit job details", module: "jobs", action: "edit" },
  { id: "4", name: "View Technicians", description: "Can view all technicians", module: "technicians", action: "view" },
  { id: "5", name: "Edit Technicians", description: "Can edit technician details", module: "technicians", action: "edit" },
  { id: "6", name: "View Finance", description: "Can view financial data", module: "finance", action: "view" },
  { id: "7", name: "Edit Finance", description: "Can edit financial data", module: "finance", action: "edit" },
  { id: "8", name: "View Reports", description: "Can view reports", module: "reports", action: "view" },
  { id: "9", name: "User Management", description: "Can manage users", module: "settings", action: "edit" },
];

// Sample users for demonstration
const initialUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "admin",
    status: "active",
    permissions: availablePermissions,
    createdAt: new Date(2023, 5, 15),
    lastLogin: new Date(),
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "manager",
    status: "active",
    permissions: availablePermissions.filter(p => p.action === "view" || p.module === "jobs"),
    createdAt: new Date(2023, 8, 10),
    lastLogin: new Date(2023, 11, 20),
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "staff",
    status: "inactive",
    permissions: availablePermissions.filter(p => p.action === "view"),
    createdAt: new Date(2023, 10, 5),
    lastLogin: new Date(2023, 10, 15),
  },
  {
    id: "4",
    name: "Jessica Davis",
    email: "jessica.davis@example.com",
    role: "viewer",
    status: "pending",
    permissions: availablePermissions.filter(p => p.action === "view" && p.module !== "settings"),
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

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      bio: "Sales manager with 5+ years of experience in client relationship management.",
      phone: "(555) 123-4567",
      jobTitle: "Sales Manager",
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

  function onProfileSubmit(data: ProfileFormValues) {
    toast.success("Profile updated", {
      description: "Your profile information has been updated successfully.",
    });
  }

  function onNotificationsSubmit(data: NotificationsFormValues) {
    toast.success("Notification preferences updated", {
      description: "Your notification preferences have been saved.",
    });
  }
  
  function onAddUserSubmit(data: UserFormValues) {
    const newUser: User = {
      id: `${users.length + 1}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      permissions: availablePermissions.filter(p => {
        if (data.role === "admin") return true;
        if (data.role === "manager") return p.module !== "settings" || p.action !== "edit";
        if (data.role === "staff") return p.action === "view" || (p.module === "jobs" && p.action !== "delete");
        return p.action === "view";
      }),
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

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button size="sm" variant="outline">
                  Change Avatar
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  Remove
                </Button>
              </div>
            </div>

            <Separator />

            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
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
                    control={profileForm.control}
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
                    control={profileForm.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tell us a little about yourself"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description for your profile. URLs are hyperlinked.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update profile</Button>
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
            <div className="flex justify-between items-center">
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
                <DialogContent>
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
                            <UserCog className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, "active")}>
                            <Check className="mr-2 h-4 w-4" />
                            Set as Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, "inactive")}>
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
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      Manage User Permissions
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedUser && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{selectedUser.name}</span>
                        <Badge variant="outline" className={roleDisplay[selectedUser.role].color}>
                          {roleDisplay[selectedUser.role].label}
                        </Badge>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                {selectedUser && (
                  <div className="h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                      {["jobs", "technicians", "clients", "finance", "reports", "settings"].map((module) => (
                        <div key={module} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2 capitalize">{module} Permissions</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availablePermissions
                              .filter(p => p.module === module)
                              .map((permission) => (
                                <div className="flex items-center space-x-2" key={permission.id}>
                                  <Switch
                                    id={`permission-${permission.id}`}
                                    checked={selectedUser.permissions.some(p => p.id === permission.id)}
                                    onCheckedChange={(checked) => 
                                      handleUpdatePermissions(selectedUser.id, permission.id, checked)
                                    }
                                  />
                                  <label
                                    htmlFor={`permission-${permission.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.name}
                                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button onClick={() => setShowEditPermissionsDialog(false)}>
                    Done
                  </Button>
                </DialogFooter>
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
