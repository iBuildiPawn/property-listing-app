import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Database } from '@/app/types/database.types';
import { PropertiesManagement } from '@/app/components/admin/properties-management';
import { UsersManagement } from '@/app/components/admin/users-management';
import { TransportationManagement } from '@/app/components/admin/transportation-management';

export default async function AdminDashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();
  
  if (!profile?.is_admin) {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
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