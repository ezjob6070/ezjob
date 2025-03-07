
import { ImageIcon } from "lucide-react";

interface EstimateImageGalleryProps {
  images: string[];
  maxPreview?: number;
  smallPreview?: boolean;
}

const EstimateImageGallery = ({ 
  images, 
  maxPreview = 3,
  smallPreview = true
}: EstimateImageGalleryProps) => {
  if (images.length === 0) return null;

  const imageHeight = smallPreview ? "h-16" : "h-20";
  
  return (
    <div className="mt-2">
      <div className="flex items-center gap-1 font-medium">
        <ImageIcon className="h-4 w-4" />
        <span>Images ({images.length})</span>
      </div>
      <div className={`grid grid-cols-3 gap-${smallPreview ? '1' : '2'} mt-1`}>
        {images.slice(0, maxPreview).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Job image ${index + 1}`}
            className={`w-full ${imageHeight} object-cover rounded`}
          />
        ))}
        {images.length > maxPreview && (
          <div className={`w-full ${imageHeight} bg-muted flex items-center justify-center rounded`}>
            <span className="text-xs">+{images.length - maxPreview} more</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateImageGallery;
