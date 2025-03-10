'use client';

import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { 
  MotionWrapper, 
  StaggerContainer, 
  AnimatedButton 
} from '@/app/components/animations';
import FeaturedPropertiesSection from '@/app/components/properties/featured-properties-section';
import { useAuth } from '@/app/contexts/auth-context';
import { Button } from '@/app/components/ui/button';

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
        <StaggerContainer className="container mx-auto px-6 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
          <MotionWrapper variant="fade" delay={0.2}>
            <h1 className="text-4xl font-bold mb-8 text-center">
              Kuwait Property & Transportation App
            </h1>
          </MotionWrapper>
          
          <MotionWrapper variant="slide" direction="up" delay={0.4}>
            <p className="text-xl mb-8 text-center max-w-2xl">
              Find your dream property and transportation services in Kuwait with our chatbot-driven application.
            </p>
          </MotionWrapper>
          
          <MotionWrapper variant="scale" delay={0.6}>
            {isLoading ? (
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            ) : user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton
                  variant="default"
                  size="lg"
                  icon={<User className="h-4 w-4" />}
                  iconPosition="left"
                  onClick={() => {}}
                >
                  <Link href="/routes/dashboard">
                    My Dashboard
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  onClick={() => {}}
                >
                  <Link href="/routes/public/properties">
                    Browse Properties
                  </Link>
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton
                  variant="default"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  onClick={() => {}}
                >
                  <Link href="/routes/auth/login">
                    Login
                  </Link>
                </AnimatedButton>
                
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                  onClick={() => {}}
                >
                  <Link href="/routes/auth/register">
                    Register
                  </Link>
                </AnimatedButton>
              </div>
            )}
          </MotionWrapper>
        </StaggerContainer>
      </section>
      
      {/* Featured Properties Section */}
      <FeaturedPropertiesSection />
      
      {/* Services Section */}
      <section className="w-full bg-muted/30 py-16">
        <MotionWrapper variant="fade" delay={0.8} className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Find Properties</h2>
              <p className="text-muted-foreground mb-4">
                Discover a wide range of properties in Kuwait, from apartments to villas.
              </p>
              <Link 
                href="/routes/public/properties" 
                className="text-primary hover:underline inline-flex items-center"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Transportation Services</h2>
              <p className="text-muted-foreground mb-4">
                Find reliable transportation services for all your needs in Kuwait.
              </p>
              <Link 
                href="/routes/public/transportation" 
                className="text-primary hover:underline inline-flex items-center"
              >
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </section>
    </main>
  );
} 