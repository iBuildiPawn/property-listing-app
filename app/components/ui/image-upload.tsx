import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { uploadFile, uploadMultipleFiles, StorageBucket } from '@/app/utils/storage-helpers';
import { useToast } from '@/app/components/ui/use-toast';
import { useUser } from '@supabase/auth-helpers-react';

interface ImageUploadProps {
  bucket: StorageBucket;
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  initialImages?: string[];
  customPath?: string;
  className?: string;
}

export function ImageUpload({
  bucket,
  onUpload,
  multiple = false,
  maxFiles = 5,
  initialImages = [],
  customPath,
  className = '',
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const user = useUser();

  const handleUpload = useCallback(async (files: FileList) => {
    try {
      if (!files || files.length === 0) return;

      // Check if adding these files would exceed the maximum
      if (images.length + files.length > maxFiles) {
        toast({
          title: 'Too many files',
          description: `You can only upload a maximum of ${maxFiles} images.`,
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);

      const fileArray = Array.from(files);
      let urls: string[] = [];

      if (multiple) {
        urls = await uploadMultipleFiles(bucket, fileArray, user?.id, customPath);
      } else {
        const url = await uploadFile(bucket, fileArray[0], user?.id, customPath);
        urls = [url];
      }

      setImages(prev => [...prev, ...urls]);
      onUpload([...images, ...urls]);

      toast({
        title: 'Upload successful',
        description: `Successfully uploaded ${urls.length} image${urls.length !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image(s).',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, [bucket, customPath, images, maxFiles, multiple, onUpload, toast, user?.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleUpload(event.target.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onUpload(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={src}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {images.length < maxFiles && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-all"
            disabled={uploading}
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6 text-gray-400" />}
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading || images.length >= maxFiles}
        variant="outline"
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {multiple ? 'Upload Images' : 'Upload Image'}
          </>
        )}
      </Button>
    </div>
  );
} 