"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Database } from '@/app/types/database.types';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Globe, 
  ArrowLeft,
  DollarSign,
  Share2,
  Clock,
  Info
} from 'lucide-react';

type TransportationService = Database['public']['Tables']['transportation_services']['Row'];

export default function TransportationDetailPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<TransportationService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    fetchService();
  }, [params.id]);
  
  const fetchService = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transportation_services')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      setService(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transportation service:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPriceRangeLabel = (priceRange: string) => {
    switch (priceRange) {
      case 'low':
        return { label: 'Budget-friendly', icon: 1 };
      case 'medium':
        return { label: 'Mid-range', icon: 2 };
      case 'high':
        return { label: 'Premium', icon: 3 };
      default:
        return { label: 'Varies', icon: 1 };
    }
  };
  
  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'moving':
        return 'Moving Service';
      case 'ride_sharing':
        return 'Ride Sharing';
      case 'public_transport':
        return 'Public Transport';
      case 'car_rental':
        return 'Car Rental';
      default:
        return serviceType;
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.name || 'Transportation Service',
        text: service?.description || 'Check out this transportation service!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <span className="mt-4 text-muted-foreground">Loading service details...</span>
        </div>
      </div>
    );
  }
  
  if (error || !service) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error || 'Transportation service not found'}
        </div>
        <Link 
          href="/routes/public/transportation" 
          className="mt-4 inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to transportation services</span>
        </Link>
      </div>
    );
  }
  
  const priceInfo = getPriceRangeLabel(service.price_range);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link 
          href="/routes/public/transportation" 
          className="inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to transportation services</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
            <Image
              src={service.images[activeImageIndex] || '/placeholder-transportation.jpg'}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
          
          {service.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {service.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${service.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right column - Details */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary mb-2">
                  {getServiceTypeLabel(service.service_type)}
                </div>
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{service.location}</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="rounded-full bg-background p-2 hover:bg-muted/50"
                aria-label="Share service"
              >
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Price Range</h2>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">{priceInfo.label}</span>
                  <div className="flex">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <DollarSign 
                        key={i} 
                        className={`h-4 w-4 ${i < priceInfo.icon ? 'text-primary' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Contact</h3>
                  <p className="text-sm text-muted-foreground">{service.contact_info}</p>
                </div>
              </div>
              
              {service.website && (
                <div className="flex items-center">
                  <Globe className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-medium">Website</h3>
                    <a 
                      href={service.website.startsWith('http') ? service.website : `https://${service.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {service.website}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.is_available ? 'Currently Available' : 'Currently Unavailable'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Contact Service
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">About this service</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="whitespace-pre-line">{service.description}</p>
        </div>
      </div>
      
      {/* Location */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            <span>{service.location}</span>
          </div>
          {/* In a real app, you would integrate a map here */}
          <div className="mt-4 aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Map placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Related properties */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Related Properties</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-center py-8">
            <Info className="mr-2 h-5 w-5 text-muted-foreground" />
            <p className="text-muted-foreground">
              Properties that might need this service will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 