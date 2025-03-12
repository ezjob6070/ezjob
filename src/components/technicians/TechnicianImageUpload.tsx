
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface TechnicianImageUploadProps {
  initials: string;
  defaultImage?: string;
  onImageChange: (image: string | null) => void;
  size?: "sm" | "md" | "lg";
}

export function TechnicianImageUpload({ 
  initials, 
  defaultImage, 
  onImageChange,
  size = "md"
}: TechnicianImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultImage || null);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-20 w-20"
  };

  const avatarSize = sizeClasses[size];
  const initialsSize = size === "lg" ? "text-xl" : "text-base";

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        onImageChange(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageChange(null);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <Avatar className={avatarSize}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Technician Avatar"
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <AvatarFallback className={`bg-primary text-primary-foreground ${initialsSize}`}>
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        {selectedImage && (
          <Button 
            variant="destructive" 
            size="icon"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div>
        <Label htmlFor="picture" className="cursor-pointer flex items-center text-xs gap-1 text-muted-foreground hover:text-foreground">
          <Upload className="h-3 w-3" />
          {selectedImage ? "Change Photo" : "Upload Photo"}
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
}
