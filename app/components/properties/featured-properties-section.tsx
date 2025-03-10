'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Database } from '@/app/types/database.types';
import { useAuth } from '@/app/contexts/auth-context';
import FeaturedPropertyCard from './featured-property-card';
import { MotionWrapper, StaggerContainer } from '@/app/components/animations';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

type Property = Database['public']['Tables']['properties']['Row'];

export default function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) {
        throw error;
      }
      
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching featured properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-destructive">Error loading properties: {error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-muted-foreground">No featured properties available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <StaggerContainer className="container mx-auto px-4">
        <MotionWrapper variant="fade" className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">
                Discover our handpicked selection of premium properties in Kuwait
              </p>
            </div>
            <Link href="/routes/public/properties">
              <Button variant="outline" className="hidden sm:flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {properties.map((property, index) => (
            <MotionWrapper key={property.id} variant="slide" direction="up" delay={0.1 * index}>
              <FeaturedPropertyCard
                property={property}
                isAuthenticated={!!user}
                index={index}
              />
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper variant="fade" delay={0.4} className="mt-8 sm:hidden flex justify-center">
          <Link href="/routes/public/properties">
            <Button variant="outline" className="flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </MotionWrapper>
      </StaggerContainer>
    </div>
  );
} 