"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/types/database.types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';

export function AdminStatusChecker() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const supabase = createClientComponentClient<Database>();
  const { user: authUser, session: authSession } = useAuth();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        setLoading(true);
        setError(null);

        // Debug information
        const debug = {
          authContextUser: authUser ? { id: authUser.id, email: authUser.email } : null,
          authContextSession: authSession ? { id: authSession.access_token ? 'present' : 'missing' } : null,
        };

        // First try to use the user from auth context
        if (authUser) {
          setUser(authUser);
          debug.usingAuthContext = true;
          
          // Get profile with admin status
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (profileError) {
            debug.profileError = profileError.message;
            throw new Error(`Profile error: ${profileError.message}`);
          }
          
          setProfile(profileData);
          debug.profile = profileData;
          setDebugInfo(debug);
          return;
        }

        // Fallback to getting session directly from supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        debug.supabaseSession = session ? { id: session.access_token ? 'present' : 'missing' } : null;
        debug.sessionError = sessionError ? sessionError.message : null;
        
        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }
        
        if (!session) {
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          debug.refreshAttempt = true;
          debug.refreshError = refreshError ? refreshError.message : null;
          debug.refreshedSession = refreshData.session ? { id: refreshData.session.access_token ? 'present' : 'missing' } : null;
          
          if (refreshError || !refreshData.session) {
            throw new Error('No active session found. Please log in.');
          }
          
          setUser(refreshData.session.user);
          debug.usingRefreshedSession = true;
        } else {
          setUser(session.user);
          debug.usingExistingSession = true;
        }
        
        if (!user) {
          throw new Error('Unable to get user information. Please log in again.');
        }
        
        // Get profile with admin status
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          debug.profileError = profileError.message;
          throw new Error(`Profile error: ${profileError.message}`);
        }
        
        setProfile(profileData);
        debug.profile = profileData;
        setDebugInfo(debug);
      } catch (err: any) {
        setError(err.message);
        console.error('Admin status check error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [supabase, authUser, authSession]);
  
  const makeAdmin = async () => {
    if (!user || !profile) return;
    
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
      toast.success('You are now an admin! Please refresh the page.');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to make admin: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const forceLogin = async () => {
    // Redirect to login page with return URL
    window.location.href = `/routes/auth/login?returnUrl=${encodeURIComponent('/routes/admin-check')}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checking Admin Status</CardTitle>
          <CardDescription>Please wait...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not check admin status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          
          {error.includes('No active session') && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="mb-2">It seems you're not properly logged in or your session has expired.</p>
              <Button onClick={forceLogin}>Log In Again</Button>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="font-semibold mb-2">Debug Information:</p>
            <pre className="text-xs overflow-auto p-2 bg-background rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Status Checker</CardTitle>
        <CardDescription>Check if you have admin privileges</CardDescription>
      </CardHeader>
      <CardContent>
        {user && profile ? (
          <div className="space-y-4">
            <div>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Name:</strong> {profile.full_name}</p>
              <p><strong>Admin Status:</strong> {profile.is_admin ? 'Admin ✅' : 'Not Admin ❌'}</p>
            </div>
            
            {!profile.is_admin && (
              <div className="bg-muted p-4 rounded-md">
                <p className="mb-2">You are not an admin. You can make yourself an admin by clicking the button below.</p>
                <Button onClick={makeAdmin} disabled={loading}>
                  {loading ? 'Processing...' : 'Make Me Admin'}
                </Button>
              </div>
            )}
            
            {profile.is_admin && (
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-md">
                <p>You are an admin! You should be able to access the admin dashboard.</p>
                <p className="mt-2">
                  <a href="/routes/admin" className="text-primary hover:underline">
                    Go to Admin Dashboard
                  </a>
                </p>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="font-semibold mb-2">Debug Information:</p>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p>No user data found. Please log in.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
} 