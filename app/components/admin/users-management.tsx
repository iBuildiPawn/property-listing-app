'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/types/database.types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { toast } from '@/app/components/ui/use-toast';
import { Loader2, Search, UserCog, Shield, ShieldOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Switch } from '@/app/components/ui/switch';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function UsersManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  }

  async function toggleAdminStatus(id: string, currentStatus: boolean) {
    // Prevent removing admin status from yourself
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === id && currentStatus) {
      toast({
        title: 'Cannot remove admin status',
        description: 'You cannot remove your own admin status',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'User updated',
        description: `User is ${!currentStatus ? 'now an admin' : 'no longer an admin'}`,
      });
      fetchProfiles();
    }
  }

  const filteredProfiles = profiles.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.user_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Admin Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
                        <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{profile.full_name || 'Unnamed User'}</span>
                    </TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell className="capitalize">{profile.user_type || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={profile.is_admin ? "default" : "secondary"}>
                        {profile.is_admin ? 'Admin' : 'Regular User'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-sm text-muted-foreground mr-2">
                          {profile.is_admin ? 'Admin' : 'Make Admin'}
                        </span>
                        <Switch
                          checked={profile.is_admin}
                          onCheckedChange={() => toggleAdminStatus(profile.id, profile.is_admin)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 