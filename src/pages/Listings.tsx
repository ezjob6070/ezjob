
import { useState } from "react";
import { Building, Home, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample listings data
  const listings = [
    {
      id: "1",
      title: "Modern Luxury Villa",
      address: "123 Lakefront Drive",
      price: 1250000,
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 3200,
      type: "Residential",
      status: "Active",
      listedDate: "2023-04-15"
    },
    {
      id: "2",
      title: "Downtown Office Space",
      address: "456 Business Avenue",
      price: 875000,
      sqft: 2800,
      type: "Commercial",
      status: "Active",
      listedDate: "2023-03-28"
    },
    {
      id: "3",
      title: "Waterfront Condo",
      address: "789 Harbor View",
      price: 650000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1500,
      type: "Residential",
      status: "Pending",
      listedDate: "2023-04-02"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Manage your property listings and track their status
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  {listing.type === "Residential" ? (
                    <Home className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Building className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <Badge variant={listing.status === "Active" ? "default" : "secondary"}>
                      {listing.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{listing.address}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">{formatCurrency(listing.price)}</p>
                      <p className="text-muted-foreground">Price</p>
                    </div>
                    <div>
                      <p className="font-medium">{listing.sqft} sqft</p>
                      <p className="text-muted-foreground">Area</p>
                    </div>
                    {listing.bedrooms && (
                      <div>
                        <p className="font-medium">{listing.bedrooms} BR</p>
                        <p className="text-muted-foreground">Bedrooms</p>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div>
                        <p className="font-medium">{listing.bathrooms} BA</p>
                        <p className="text-muted-foreground">Bathrooms</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings
              .filter((listing) => listing.status === "Active")
              .map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  {/* Same card content as above */}
                  <div className="h-48 bg-muted flex items-center justify-center">
                    {listing.type === "Residential" ? (
                      <Home className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Building className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.address}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">{formatCurrency(listing.price)}</p>
                        <p className="text-muted-foreground">Price</p>
                      </div>
                      <div>
                        <p className="font-medium">{listing.sqft} sqft</p>
                        <p className="text-muted-foreground">Area</p>
                      </div>
                      {listing.bedrooms && (
                        <div>
                          <p className="font-medium">{listing.bedrooms} BR</p>
                          <p className="text-muted-foreground">Bedrooms</p>
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div>
                          <p className="font-medium">{listing.bathrooms} BA</p>
                          <p className="text-muted-foreground">Bathrooms</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings
              .filter((listing) => listing.status === "Pending")
              .map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  {/* Similar card content */}
                  <div className="h-48 bg-muted flex items-center justify-center">
                    {listing.type === "Residential" ? (
                      <Home className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <Building className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.address}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">{formatCurrency(listing.price)}</p>
                        <p className="text-muted-foreground">Price</p>
                      </div>
                      <div>
                        <p className="font-medium">{listing.sqft} sqft</p>
                        <p className="text-muted-foreground">Area</p>
                      </div>
                      {listing.bedrooms && (
                        <div>
                          <p className="font-medium">{listing.bedrooms} BR</p>
                          <p className="text-muted-foreground">Bedrooms</p>
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div>
                          <p className="font-medium">{listing.bathrooms} BA</p>
                          <p className="text-muted-foreground">Bathrooms</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="sold" className="mt-4">
          <div className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No sold listings yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sold listings will appear here once transactions are completed.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Listings;
