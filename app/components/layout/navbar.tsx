"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, MessageSquare, Building, Truck, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/types/database.types';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(data?.is_admin || false);
      } else {
        setIsAdmin(false);
      }
    }
    
    checkAdminStatus();
  }, [user, supabase]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/routes/public/properties', icon: Building },
    { name: 'Transportation', href: '/routes/public/transportation', icon: Truck },
    { name: 'Chat Assistant', href: '/routes/public/chat', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">PropertyFinder</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    href="/routes/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-primary hover:bg-primary/10"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/routes/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted/50"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/routes/auth/login"
                  className="px-4 py-2 text-sm rounded-md hover:bg-muted/50"
                >
                  Login
                </Link>
                <Link
                  href="/routes/auth/register"
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted/50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-border">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="flex items-center px-5 py-3">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 rounded-full bg-muted p-2" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium">Account</div>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/routes/admin"
                      onClick={closeMenu}
                      className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10 flex items-center"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/routes/dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/routes/auth/login"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/routes/auth/register"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 