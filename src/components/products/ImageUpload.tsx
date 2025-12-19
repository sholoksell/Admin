import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from '@/lib/axios';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImages = [...images, ...response.data.urls];
      onChange(newImages);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const filename = imageUrl.split('/').pop();
      await axios.delete(`/upload/${filename}`);
      onChange(images.filter((img) => img !== imageUrl));
      toast.success('Image removed');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove image');
    }
  };

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Images</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={getFullImageUrl(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(image)}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Upload Images" to add product images
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} images • First image will be the primary image
      </p>
    </div>
  );
}
