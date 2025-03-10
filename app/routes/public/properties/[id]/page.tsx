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
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Loader2
} from 'lucide-react';
import { getValidImageUrl, getPlaceholderImage } from '@/app/utils/image-utils';
import OptimizedImage from '@/app/components/ui/optimized-image';
import { 
  MotionWrapper, 
  StaggerContainer,
  AnimatedButton,
  ScrollAnimation
} from '@/app/components/animations';
import { motion, AnimatePresence } from 'framer-motion';

type Property = Database['public']['Tables']['properties']['Row'];

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    return `${price.toLocaleString()} KWD`;
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
  
  const openPreview = () => {
    setIsPreviewOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closePreview = () => {
    setIsPreviewOpen(false);
    // Restore scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };
  
  const goToNextImage = () => {
    if (property && property.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const goToPrevImage = () => {
    if (property && property.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closePreview();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
        case 'ArrowLeft':
          goToPrevImage();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, property]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <MotionWrapper variant="fade" className="mb-6">
        <Link 
          href="/routes/public/properties" 
          className="inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to properties</span>
        </Link>
      </MotionWrapper>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <MotionWrapper variant="slide" direction="right" className="lg:col-span-2">
          <div 
            className="relative rounded-lg overflow-hidden aspect-[16/9] cursor-pointer group"
            onClick={openPreview}
          >
            <OptimizedImage
              src={property.images[activeImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              fallbackType="property"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/50 rounded-full p-2">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          {property.images.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 grid grid-cols-5 gap-2"
            >
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(index);
                  }}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <OptimizedImage
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    fallbackType="property"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </MotionWrapper>
        
        {/* Right column - Details */}
        <MotionWrapper variant="slide" direction="left" className="space-y-6">
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
                  <AnimatedButton
                    onClick={toggleFavorite}
                    className="rounded-full bg-background p-2 hover:bg-muted/50"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </AnimatedButton>
                )}
                
                <AnimatedButton
                  onClick={handleShare}
                  className="rounded-full bg-background p-2 hover:bg-muted/50"
                  aria-label="Share property"
                >
                  <Share2 className="h-5 w-5 text-muted-foreground" />
                </AnimatedButton>
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
                  <span>{property.size} m²</span>
                </div>
              </div>
              
              <StaggerContainer className="mt-6 space-y-6" staggerDelay={0.1}>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Property Type</h2>
                  <p className="capitalize">{property.property_type}</p>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">Amenities</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-center"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 }
                        }}
                      >
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{amenity}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <AnimatedButton
                    variant="default"
                    className="w-full rounded-md px-4 py-2"
                  >
                    Contact Agent
                  </AnimatedButton>
                </div>
              </StaggerContainer>
            </div>
          </div>
        </MotionWrapper>
      </div>
      
      {/* Description */}
      <ScrollAnimation effect="fade" className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="whitespace-pre-line">{property.description}</p>
        </div>
      </ScrollAnimation>
      
      {/* Image Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex flex-col">
              {/* Close button */}
              <AnimatedButton 
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                aria-label="Close preview"
              >
                <X className="h-6 w-6" />
              </AnimatedButton>
              
              {/* Image counter */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 rounded-md px-3 py-1 text-white text-sm">
                {activeImageIndex + 1} / {property.images.length}
              </div>
              
              {/* Main image container */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-10">
                <motion.div 
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto"
                >
                  <OptimizedImage
                    src={property.images[activeImageIndex]}
                    alt={property.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                    fallbackType="property"
                  />
                </motion.div>
              </div>
              
              {/* Navigation buttons */}
              {property.images.length > 1 && (
                <>
                  <AnimatedButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </AnimatedButton>
                  <AnimatedButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </AnimatedButton>
                </>
              )}
              
              {/* Thumbnail navigation */}
              {property.images.length > 1 && (
                <div className="p-4 flex justify-center">
                  <div className="flex space-x-2 overflow-x-auto max-w-full pb-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                          activeImageIndex === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <OptimizedImage
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          fallbackType="property"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 