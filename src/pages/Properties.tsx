
import React, { useState } from "react";
import { PlusIcon, SearchIcon, FilterIcon, SlidersHorizontal, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Sample property data
const initialProperties = [
  {
    id: "1",
    title: "Modern Downtown Condo",
    address: "123 Main St, New York, NY",
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Condo",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000&auto=format&fit=crop",
    description: "Stunning downtown condo with amazing city views and modern amenities."
  },
  {
    id: "2",
    title: "Spacious Family Home",
    address: "456 Oak Ave, Los Angeles, CA",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    type: "Single Family",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=1000&auto=format&fit=crop",
    description: "Beautiful spacious family home in a quiet neighborhood with a large backyard."
  },
  {
    id: "3",
    title: "Luxury Waterfront Villa",
    address: "789 Beach Rd, Miami, FL",
    price: 3500000,
    bedrooms: 5,
    bathrooms: 4.5,
    sqft: 4500,
    type: "Villa",
    status: "For Sale",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop",
    description: "Stunning waterfront villa with private beach access and panoramic ocean views."
  },
  {
    id: "4",
    title: "Downtown Apartment",
    address: "101 City Center, Chicago, IL",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 850,
    type: "Apartment",
    status: "For Rent",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
    description: "Modern apartment in the heart of downtown with great amenities."
  },
];

const PropertyCard = ({ property }: { property: any }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
          {property.status}
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-1 truncate">{property.title}</h3>
        <p className="text-muted-foreground text-sm mb-2 truncate">{property.address}</p>
        <div className="flex justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            {property.status === "For Rent" 
              ? `$${property.price.toLocaleString()}/mo` 
              : `$${property.price.toLocaleString()}`
            }
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          <div className="flex flex-col items-center p-1 bg-muted rounded">
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-xs text-muted-foreground">Beds</span>
          </div>
          <div className="flex flex-col items-center p-1 bg-muted rounded">
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-xs text-muted-foreground">Baths</span>
          </div>
          <div className="flex flex-col items-center p-1 bg-muted rounded">
            <span className="font-medium">{property.sqft.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Sq.ft</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{property.description}</p>
        <div className="mt-auto pt-2">
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Properties = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    type: "Single Family",
    status: "For Sale",
    description: ""
  });

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    const propertyToAdd = {
      id: Date.now().toString(),
      ...newProperty,
      price: parseFloat(newProperty.price),
      bedrooms: parseInt(newProperty.bedrooms),
      bathrooms: parseFloat(newProperty.bathrooms),
      sqft: parseInt(newProperty.sqft),
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000&auto=format&fit=crop",
    };
    
    setProperties([propertyToAdd, ...properties]);
    setIsAddPropertyOpen(false);
    setNewProperty({
      title: "",
      address: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      type: "Single Family",
      status: "For Sale",
      description: ""
    });
    
    toast.success("Property added successfully!");
  };

  const handleFileUpload = () => {
    toast.success("Bulk property upload feature will be implemented soon!");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Properties</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleFileUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button 
            onClick={() => setIsAddPropertyOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="sale">For Sale</TabsTrigger>
            <TabsTrigger value="rent">For Rent</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No properties found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sale" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties
                .filter(p => p.status === "For Sale")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="rent" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties
                .filter(p => p.status === "For Rent")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties
                .filter(p => p.status === "Pending")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="sold" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties
                .filter(p => p.status === "Sold")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Property Dialog */}
      <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new property to your listings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Property Title</Label>
              <Input 
                id="title" 
                value={newProperty.title}
                onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                placeholder="e.g., Modern Downtown Condo"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={newProperty.address}
                onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                placeholder="e.g., 123 Main St, New York, NY"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={newProperty.price}
                  onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                  placeholder="e.g., 750000"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProperty.status}
                  onValueChange={(value) => setNewProperty({...newProperty, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input 
                  id="bedrooms" 
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                  placeholder="e.g., 2"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input 
                  id="bathrooms" 
                  type="number"
                  step="0.5"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                  placeholder="e.g., 2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="sqft">Square Feet</Label>
                <Input 
                  id="sqft" 
                  type="number"
                  value={newProperty.sqft}
                  onChange={(e) => setNewProperty({...newProperty, sqft: e.target.value})}
                  placeholder="e.g., 1200"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="type">Property Type</Label>
                <Select 
                  value={newProperty.type}
                  onValueChange={(value) => setNewProperty({...newProperty, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Family">Single Family</SelectItem>
                    <SelectItem value="Condo">Condo</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newProperty.description}
                onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                placeholder="Enter property description..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label>Property Images</Label>
              <div className="border-2 border-dashed rounded-md p-8 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your images here, or <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (This feature is not functional in this demo)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPropertyOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProperty}>Add Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Properties;
