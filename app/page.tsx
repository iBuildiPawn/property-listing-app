'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { 
  MotionWrapper, 
  StaggerContainer, 
  AnimatedButton 
} from '@/app/components/animations';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <StaggerContainer className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
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
        </MotionWrapper>
        
        <MotionWrapper variant="fade" delay={0.8} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
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
      </StaggerContainer>
    </main>
  );
} 