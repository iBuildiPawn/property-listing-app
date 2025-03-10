"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Database } from '@/app/types/database.types';
import { useAuth } from '@/app/contexts/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BedDouble, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  Share2, 
  ArrowLeft,
  Check
} from 'lucide-react';

type Property = Database['public']['Tables']['properties']['Row'];

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchProperty();
    if (user) {
      checkIfFavorite();
    }
  }, [params.id, user]);
  
  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      setProperty(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching property:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkIfFavorite = async () => {
    // This is a placeholder for checking if a property is in user's favorites
    // In a real app, you would check against a favorites table
    setIsFavorite(false);
  };
  
  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would update the favorites in the database
  };
  
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Property Listing',
        text: property?.description || 'Check out this property!',
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
          <span className="mt-4 text-muted-foreground">Loading property details...</span>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error || 'Property not found'}
        </div>
        <Link 
          href="/routes/public/properties" 
          className="mt-4 inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to properties</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link 
          href="/routes/public/properties" 
          className="inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to properties</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <div className="relative rounded-lg overflow-hidden aspect-[16/9]">
            <Image
              src={property.images[activeImageIndex] || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          
          {property.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
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
                <h1 className="text-2xl font-bold">{property.title}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {user && (
                  <button
                    onClick={toggleFavorite}
                    className="rounded-full bg-background p-2 hover:bg-muted/50"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="rounded-full bg-background p-2 hover:bg-muted/50"
                  aria-label="Share property"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="text-3xl font-bold text-primary">
                {property.property_type === 'apartment' || property.property_type === 'condo' 
                  ? `${formatPrice(property.price)}/month` 
                  : formatPrice(property.price)}
              </div>
              
              <div className="mt-4 flex items-center justify-between border-t border-b border-border py-4">
                <div className="flex items-center">
                  <BedDouble className="mr-1 h-5 w-5 text-muted-foreground" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="mr-1 h-5 w-5 text-muted-foreground" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
                <div className="flex items-center">
                  <Square className="mr-1 h-5 w-5 text-muted-foreground" />
                  <span>{property.size} sqft</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Property Type</h2>
                <p className="capitalize">{property.property_type}</p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Amenities</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="whitespace-pre-line">{property.description}</p>
        </div>
      </div>
      
      {/* Location */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            <span>{property.location}</span>
          </div>
          {/* In a real app, you would integrate a map here */}
          <div className="mt-4 aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Map placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Transportation options */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Transportation Options</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-center text-muted-foreground py-8">
            Transportation options will be displayed here.
            <br />
            <Link href="/routes/public/transportation" className="text-primary hover:text-primary/90">
              Browse all transportation services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 