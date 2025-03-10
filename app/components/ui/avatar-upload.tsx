import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Loader2, Upload, Camera } from 'lucide-react';
import { uploadFile, StorageBucket } from '@/app/utils/storage-helpers';
import { useToast } from '@/app/components/ui/use-toast';
import { useAuth } from '@/app/contexts/auth-context';

interface AvatarUploadProps {
  initialImage?: string;
  onUpload: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarUpload({
  initialImage,
  onUpload,
  size = 'lg',
  className = '',
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Size mapping
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  const handleUpload = async (file: File) => {
    try {
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to upload an avatar.',
          variant: 'destructive',
        });
        return;
      }

      setUploading(true);

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        });
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Avatar image must be less than 2MB.',
          variant: 'destructive',
        });
        return;
      }

      const url = await uploadFile(StorageBucket.AVATARS, file, user.id);
      
      setAvatarUrl(url);
      onUpload(url);

      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your avatar.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleUpload(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Get initials from user email or id for the avatar fallback
  const getInitials = () => {
    if (!user) return '?';
    
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return user.id.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-gray-200`}>
          <AvatarImage src={avatarUrl} alt="User avatar" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={handleButtonClick}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
          disabled={uploading}
          aria-label="Change avatar"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        variant="outline"
        size="sm"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Change Avatar
          </>
        )}
      </Button>
    </div>
  );
} 