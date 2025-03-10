"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import { Building, Truck, MessageSquare, User, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/routes/auth/login');
    } else if (user) {
      fetchProfile();
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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile?.full_name || 'User'}</h2>
                <p className="text-muted-foreground text-sm">{profile?.email}</p>
                <p className="text-xs mt-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block capitalize">
                  {profile?.user_type || 'User'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                href="/routes/dashboard"
                className="flex items-center space-x-2 p-2 rounded-md bg-primary/10 text-primary"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/routes/dashboard/properties"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <Building className="h-4 w-4" />
                <span>My Properties</span>
              </Link>
              <Link
                href="/routes/dashboard/transportation"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <Truck className="h-4 w-4" />
                <span>Transportation</span>
              </Link>
              <Link
                href="/routes/dashboard/messages"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Link>
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