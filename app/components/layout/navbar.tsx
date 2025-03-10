"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, MessageSquare, Building, Truck, User, LogOut, Shield, UserCog, ChevronDown } from 'lucide-react';
import { useAuth } from '@/app/contexts/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/types/database.types';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const supabase = createClientComponentClient<Database>();
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Close user menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">PropertyFinder</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
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

            {isAdmin && (
              <Link
                href="/routes/admin"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/routes/admin')
                    ? 'bg-primary/10 text-primary'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex md:items-center">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-muted/50"
                >
                  <User className="h-5 w-5" />
                  <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                    <Link
                      href="/routes/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/routes/admin-check"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Admin Check
                    </Link>
                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
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
              </div>
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

            {isAdmin && (
              <Link
                href="/routes/admin"
                onClick={closeMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
              >
                <Shield className="h-5 w-5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

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
                      <div className="text-base font-medium truncate max-w-[200px]">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/routes/dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 flex items-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/routes/admin-check"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted flex items-center"
                  >
                    <UserCog className="h-5 w-5 mr-2" />
                    Admin Check
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
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