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
  CircleDollarSign,
  Share2,
  Clock,
  Info,
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

type TransportationService = Database['public']['Tables']['transportation_services']['Row'];

export default function TransportationDetailPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<TransportationService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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
    if (service && service.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const goToPrevImage = () => {
    if (service && service.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
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
  }, [isPreviewOpen, service]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <MotionWrapper variant="fade" className="mb-6">
        <Link 
          href="/routes/public/transportation" 
          className="inline-flex items-center text-primary hover:text-primary/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to transportation services</span>
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
              src={service.images[activeImageIndex]}
              alt={service.name}
              fill
              className="object-cover"
              fallbackType="transportation"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/50 rounded-full p-2">
                <ZoomIn className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          {service.images.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 grid grid-cols-5 gap-2"
            >
              {service.images.map((image, index) => (
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
                    alt={`${service.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    fallbackType="transportation"
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
                <div className="inline-block rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary mb-2">
                  {getServiceTypeLabel(service.service_type)}
                </div>
                <h1 className="text-2xl font-bold">{service.name}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{service.location}</span>
                </div>
              </div>
              
              <AnimatedButton
                onClick={handleShare}
                className="rounded-full bg-background p-2 hover:bg-muted/50"
                aria-label="Share service"
              >
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </AnimatedButton>
            </div>
            
            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Price Range</h2>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">{priceInfo.label}</span>
                  <div className="flex">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <CircleDollarSign 
                        key={i} 
                        className={`h-4 w-4 ${i < priceInfo.icon ? 'text-primary' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                    <span className="ml-1 text-xs">KWD</span>
                  </div>
                </div>
              </div>
            </div>
            
            <StaggerContainer className="mt-6 space-y-4" staggerDelay={0.1}>
              <motion.div 
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Phone className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Contact</h3>
                  <p className="text-sm text-muted-foreground">{service.contact_info}</p>
                </div>
              </motion.div>
              
              {service.website && (
                <motion.div 
                  className="flex items-center"
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
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
                </motion.div>
              )}
              
              <motion.div 
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Clock className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.is_available ? 'Currently Available' : 'Currently Unavailable'}
                  </p>
                </div>
              </motion.div>
              
              <div className="mt-6">
                <AnimatedButton
                  variant="default"
                  className="w-full rounded-md px-4 py-2"
                >
                  Contact Service
                </AnimatedButton>
              </div>
            </StaggerContainer>
          </div>
        </MotionWrapper>
      </div>
      
      {/* Description */}
      <ScrollAnimation effect="fade" className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="whitespace-pre-line">{service.description}</p>
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
                {activeImageIndex + 1} / {service.images.length}
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
                    src={service.images[activeImageIndex]}
                    alt={service.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority
                    fallbackType="transportation"
                  />
                </motion.div>
              </div>
              
              {/* Navigation buttons */}
              {service.images.length > 1 && (
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
              {service.images.length > 1 && (
                <div className="p-4 flex justify-center">
                  <div className="flex space-x-2 overflow-x-auto max-w-full pb-2">
                    {service.images.map((image, index) => (
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
                          fallbackType="transportation"
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