
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TechnicianImageUploadProps {
  initials: string;
  defaultImage?: string;
  onImageChange: (image: string | null) => void;
}

export function TechnicianImageUpload({ 
  initials, 
  defaultImage, 
  onImageChange 
}: TechnicianImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultImage || null);

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

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Technician Avatar"
            className="rounded-full"
          />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback>
        )}
      </Avatar>
      <div>
        <Label htmlFor="picture" className="cursor-pointer">Change Picture</Label>
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
