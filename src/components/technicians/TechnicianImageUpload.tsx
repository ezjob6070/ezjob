import React from 'react';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera, Image, User } from "lucide-react";
import { toast } from "sonner";

interface TechnicianImageUploadProps {
  initials: string;
  onImageChange: (image: string) => void;
  size: "lg" | "md" | "sm";
  initialImage?: string;
}

export const TechnicianImageUpload: React.FC<TechnicianImageUploadProps> = ({ 
  initials, 
  onImageChange, 
  size, 
  initialImage 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const avatarSize = sizeClasses[size];
  const initialsSize = size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-base";

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image is too large. Maximum size is 5MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        onImageChange(imageData);
        toast.success("Photo uploaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to read the image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageChange(null);
    toast.success("Photo removed successfully!");
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className="relative" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className={`${avatarSize} border-2 border-primary/10`}>
          {selectedImage ? (
            <AvatarImage
              src={selectedImage}
              alt="Technician Avatar"
              className="object-cover"
            />
          ) : (
            <AvatarFallback className={`bg-primary text-primary-foreground ${initialsSize}`}>
              {initials || <User className="h-6 w-6" />}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Overlay with camera icon on hover */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 cursor-pointer">
            <Label htmlFor="picture" className="cursor-pointer flex items-center justify-center w-full h-full">
              <Camera className="h-6 w-6 text-white" />
            </Label>
          </div>
        )}
        
        {selectedImage && (
          <Button 
            variant="destructive" 
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div>
        <Label 
          htmlFor="picture" 
          className="cursor-pointer flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          {selectedImage ? (
            <>
              <Image className="h-3 w-3" />
              Change Photo
            </>
          ) : (
            <>
              <Upload className="h-3 w-3" />
              Upload Photo
            </>
          )}
        </Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default TechnicianImageUpload;
