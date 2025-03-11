
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin } from "lucide-react";

type PropertyType = {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft: number;
  imageUrl: string;
  type: string;
  status: string;
};

type PropertyListingCardProps = {
  property: PropertyType;
};

const PropertyListingCard = ({ property }: PropertyListingCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className={
            property.status === "Active" ? "bg-green-500" : 
            property.status === "Pending" ? "bg-amber-500" : 
            "bg-blue-500"
          }>
            {property.status}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/80 text-gray-800">
            {property.type}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="text-white font-medium text-lg">{formatCurrency(property.price)}</div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
        <div className="flex items-center text-muted-foreground mb-3 text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="truncate">{property.address}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-gray-500" />
              <span>{property.bedrooms} beds</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-500" />
              <span>{property.bathrooms} baths</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1 text-gray-500" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyListingCard;
