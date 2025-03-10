"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import { Building, Truck, MessageSquare, User, LogOut, Plus, Settings, Home, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [isPropertiesLoading, setIsPropertiesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/routes/auth/login');
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
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsPropertiesLoading(false);
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
  const isOwner = profile?.user_type === 'owner';
  const isAdmin = profile?.is_admin;
  const canCreateListings = isOwner || isAdmin;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile?.full_name || 'User'} 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile?.full_name || 'User'}</h2>
                <p className="text-muted-foreground text-sm">{profile?.email}</p>
                <div className="flex flex-wrap gap-1 mt-1 justify-center">
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block capitalize">
                    {profile?.user_type || 'User'}
                  </span>
                  {isAdmin && (
                    <span className="text-xs bg-destructive/10 text-destructive rounded-full px-2 py-0.5 inline-block">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                href="/routes/dashboard"
                className="flex items-center space-x-2 p-2 rounded-md bg-primary/10 text-primary"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                href="/routes/dashboard/properties"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <Building className="h-4 w-4" />
                <span>Properties</span>
                {canCreateListings && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                    Manage
                  </span>
                )}
              </Link>
              
              <Link
                href="/routes/dashboard/transportation"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <Truck className="h-4 w-4" />
                <span>Transportation</span>
                {canCreateListings && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                    Manage
                  </span>
                )}
              </Link>
              
              <Link
                href="/routes/dashboard/messages"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Link>
              
              <Link
                href="/routes/dashboard/profile"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <Settings className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
              
              {isAdmin && (
                <Link
                  href="/routes/admin/dashboard"
                  className="flex items-center space-x-2 p-2 rounded-md text-destructive hover:bg-destructive/10"
                >
                  <User className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>
            
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center space-x-2 p-2 rounded-md text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-medium">Saved Properties</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-medium">Recent Searches</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="font-medium">Messages</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/routes/public/properties">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Search className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Browse Properties</div>
                    <div className="text-xs text-muted-foreground">Find your dream property</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/routes/public/transportation">
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <Truck className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Find Transportation</div>
                    <div className="text-xs text-muted-foreground">Moving or travel services</div>
                  </div>
                </Button>
              </Link>
              
              {canCreateListings && (
                <Link href="/routes/dashboard/properties/new">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Add Property</div>
                      <div className="text-xs text-muted-foreground">Create a new listing</div>
                    </div>
                  </Button>
                </Link>
              )}
              
              {canCreateListings && (
                <Link href="/routes/dashboard/transportation/new">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Plus className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Add Transportation</div>
                      <div className="text-xs text-muted-foreground">Create a new service</div>
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* My Properties (for owners) */}
          {canCreateListings && (
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Properties</h2>
                <Link href="/routes/dashboard/properties">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              
              {isPropertiesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven't created any property listings yet.</p>
                  <Link href="/routes/dashboard/properties/new">
                    <Button variant="link" className="mt-2">
                      Create your first property listing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="relative h-32">
                        <img 
                          src={property.images[0] || '/images/placeholder-property.jpg'} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base line-clamp-1">{property.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{property.location}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-3 pt-0">
                        <Link href={`/routes/dashboard/properties/edit/${property.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* For non-owners, show recommended properties */}
          {!canCreateListings && (
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Recommended Properties</h2>
              
              <div className="text-center py-8 text-muted-foreground">
                <p>No recommended properties yet.</p>
                <p className="mt-2">
                  <Link href="/routes/public/properties" className="text-primary hover:text-primary/90">
                    Browse properties
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 