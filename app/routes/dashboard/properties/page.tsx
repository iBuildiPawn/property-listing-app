"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, AlertCircle, Building } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import OptimizedImage from '@/app/components/ui/optimized-image';
import { Badge } from '@/app/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { formatPrice } from '@/app/utils/format-utils';
import { Database } from '@/app/types/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export default function PropertiesPage() {
  const { user, isLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/routes/auth/login?returnUrl=/routes/dashboard/properties');
    } else if (user) {
      fetchProfile();
      fetchProperties();
    }
  }, [user, isLoading, router]);

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

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties');
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsPropertiesLoading(false);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Error deleting property:', error);
        setError('Failed to delete property');
      } else {
        // Remove the deleted property from the state
        setProperties(properties.filter(property => property.id !== propertyId));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setError('An unexpected error occurred');
    }
  };

  if (isLoading || isProfileLoading) {
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
  const canCreateProperty = profile?.user_type === 'owner' || profile?.is_admin;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your property listings</p>
        </div>
        {canCreateProperty ? (
          <Link href="/routes/dashboard/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </Link>
        ) : (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Owner account required</p>
              <p className="text-sm">Only users with an Owner account can create property listings.</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          <p className="font-medium">{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => {
              setError(null);
              fetchProperties();
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      {isPropertiesLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-12 text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No properties found</h2>
          <p className="text-muted-foreground mb-6">
            {canCreateProperty 
              ? "You haven't created any property listings yet." 
              : "You need an Owner account to create property listings."}
          </p>
          {canCreateProperty && (
            <Link href="/routes/dashboard/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Property
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48">
                <OptimizedImage
                  src={property.images[0] || null}
                  alt={property.title}
                  fill
                  className="object-cover"
                  fallbackType="property"
                />
                <Badge 
                  className="absolute top-2 right-2" 
                  variant={property.is_available ? "default" : "secondary"}
                >
                  {property.is_available ? "Available" : "Not Available"}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                <CardDescription className="line-clamp-1">{property.location}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-lg">{formatPrice(property.price)}</span>
                  <div className="flex space-x-2 text-sm text-muted-foreground">
                    <span>{property.bedrooms} bed</span>
                    <span>•</span>
                    <span>{property.bathrooms} bath</span>
                    <span>•</span>
                    <span>{property.size} sqft</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/routes/dashboard/properties/edit/${property.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your property listing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProperty(property.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 