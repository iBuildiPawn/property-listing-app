"use client";

import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-md text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold">Check your email</h1>
        
        <p className="text-muted-foreground">
          We've sent you a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        
        <div className="pt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam folder or junk mail.
          </p>
          
          <div className="pt-4">
            <Link
              href="/routes/auth/login"
              className="inline-flex items-center text-primary hover:text-primary/90"
            >
              <span>Return to login</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 