
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState("company-profile");
  const [companyData, setCompanyData] = useState({
    name: "TechService Solutions",
    email: "info@techservicesolutions.com",
    phone: "(555) 123-4567",
    website: "https://techservicesolutions.com",
    industry: "Field Service Management",
    taxId: "12-3456789",
    address: "123 Business Ave, Suite 100, Tech City, TC 12345",
    description: "Premier provider of field service management solutions with over 10 years of experience serving residential and commercial clients."
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = () => {
    // In a real application, you would save this to your backend
    toast.success("Company profile updated successfully!");
  };

  return (
    <div className="space-y-6 py-3">
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600 text-sm">Manage your company settings, users and preferences</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company-profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 mb-6">
          <TabsTrigger value="company-profile" variant="blue">Company Profile</TabsTrigger>
          <TabsTrigger value="notifications" variant="blue">Notifications</TabsTrigger>
          <TabsTrigger value="users" variant="blue">Users</TabsTrigger>
          <TabsTrigger value="appearance" variant="blue">Appearance</TabsTrigger>
          <TabsTrigger value="account" variant="blue">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="company-profile" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-8">
                <Avatar className="h-24 w-24 mr-6">
                  <AvatarFallback className="bg-gray-100 text-gray-400 text-xl">
                    {companyData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Company Logo</h3>
                  <div className="flex gap-3">
                    <Button variant="outline">Upload</Button>
                    <Button variant="ghost" className="text-gray-500">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={companyData.name} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={companyData.email} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={companyData.phone} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={companyData.website} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    name="industry" 
                    value={companyData.industry} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / Business Number</Label>
                  <Input 
                    id="taxId" 
                    name="taxId" 
                    value={companyData.taxId} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={companyData.address} 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={companyData.description} 
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This description may appear on invoices, estimates, and client communications.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={handleUpdateProfile}>Update Company Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User management settings will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Appearance settings will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Account settings will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyProfile;
