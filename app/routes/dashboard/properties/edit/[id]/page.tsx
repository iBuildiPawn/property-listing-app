"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/app/lib/supabase';
import { PropertyForm } from '@/app/components/forms/property-form';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Database } from '@/app/types/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const propertyId = params.id;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/routes/auth/login?returnUrl=/routes/dashboard/properties/edit/${propertyId}`);
    } else if (user) {
      fetchProfile();
      fetchProperty();
    }
  }, [user, isLoading, router, propertyId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile information');
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        setError('Failed to load property information');
      } else {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsPropertyLoading(false);
    }
  };

  if (isLoading || isProfileLoading || isPropertyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is an owner or admin
  const canEditProperty = profile?.user_type === 'owner' || profile?.is_admin;
  
  // Check if user owns this property or is an admin
  const isOwner = property?.owner_id === user?.id;
  const canEditThisProperty = isOwner || profile?.is_admin;

  if (!canEditProperty) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Link href="/routes/dashboard/properties">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </Link>
        
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-6 rounded-md flex items-start max-w-2xl mx-auto">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Owner account required</h2>
            <p className="mb-4">
              Only users with an Owner account can edit property listings. Your current account type is: <span className="font-semibold capitalize">{profile?.user_type || 'User'}</span>
            </p>
            <p className="text-sm">
              To change your account type, please go to your profile settings and update your user type to "Owner".
            </p>
            <div className="mt-6">
              <Link href="/routes/dashboard">
                <Button variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Link href="/routes/dashboard/properties">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </Link>
        
        <div className="bg-destructive/10 text-destructive p-6 rounded-md flex items-start max-w-2xl mx-auto">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Property not found</h2>
            <p className="mb-4">
              The property you are trying to edit does not exist or has been deleted.
            </p>
            <div className="mt-6">
              <Link href="/routes/dashboard/properties">
                <Button variant="outline">
                  View My Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canEditThisProperty) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Link href="/routes/dashboard/properties">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Button>
        </Link>
        
        <div className="bg-destructive/10 text-destructive p-6 rounded-md flex items-start max-w-2xl mx-auto">
          <AlertCircle className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Permission denied</h2>
            <p className="mb-4">
              You do not have permission to edit this property. You can only edit properties that you own.
            </p>
            <div className="mt-6">
              <Link href="/routes/dashboard/properties">
                <Button variant="outline">
                  View My Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/routes/dashboard/properties">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
        </Button>
      </Link>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6">
        <PropertyForm initialData={property} propertyId={propertyId} />
      </div>
    </div>
  );
} 