"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Database } from '@/app/types/database.types';
import { PropertiesManagement } from '@/app/components/admin/properties-management';
import { UsersManagement } from '@/app/components/admin/users-management';
import { TransportationManagement } from '@/app/components/admin/transportation-management';
import { useAuth } from '@/app/contexts/auth-context';

export default function ClientAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { user, session } = useAuth();

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        setLoading(true);
        setError(null);

        // Debug information
        const debug: any = {
          authContextUser: user ? { id: user.id, email: user.email } : null,
          authContextSession: session ? { id: session.access_token ? 'present' : 'missing' } : null,
        };

        // Check if user is authenticated
        if (!user) {
          debug.error = 'No user found in auth context';
          setDebugInfo(debug);
          router.push('/routes/auth/login?returnUrl=/routes/admin');
          return;
        }

        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        debug.profileQuery = { userId: user.id };
        debug.profileError = profileError ? profileError.message : null;
        debug.profile = profileData;

        if (profileError) {
          setError(`Profile error: ${profileError.message}`);
          setDebugInfo(debug);
          return;
        }

        if (!profileData) {
          setError('No profile found for this user');
          setDebugInfo(debug);
          return;
        }

        if (!profileData.is_admin) {
          setError('You do not have admin privileges');
          setDebugInfo(debug);
          return;
        }

        // User is authenticated and has admin privileges
        setProfile(profileData);
        setDebugInfo(debug);
      } catch (err: any) {
        setError(err.message);
        console.error('Admin access check error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [user, session, router, supabase]);

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update profile to make user admin
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id);
        
      if (error) {
        throw new Error(`Update error: ${error.message}`);
      }
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(updatedProfile);
      window.location.reload(); // Reload the page to reflect changes
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You cannot access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive mb-4">{error}</p>
            
            {error === 'You do not have admin privileges' && (
              <div className="mb-4">
                <Button onClick={makeAdmin}>Make Me Admin</Button>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="font-semibold mb-2">Debug Information:</p>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" onClick={() => router.push('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Admin Status:</strong> {profile?.is_admin ? 'Admin' : 'Not Admin'}</p>
      </div>
      
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Properties Management</CardTitle>
              <CardDescription>
                Manage all property listings in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertiesManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transportation">
          <Card>
            <CardHeader>
              <CardTitle>Transportation Management</CardTitle>
              <CardDescription>
                Manage transportation services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransportationManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 