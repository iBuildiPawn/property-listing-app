'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Database } from '@/app/types/database.types';
import { MapPin, Phone, Globe, CircleDollarSign } from 'lucide-react';
import { useState, memo } from 'react';
import { generateBlurPlaceholder, getResponsiveImageSizes } from '@/app/utils/image-optimization';
import { getValidImageUrl, getPlaceholderImage } from '@/app/utils/image-utils';
import OptimizedImage from '@/app/components/ui/optimized-image';
import { AnimatedCard } from '@/app/components/animations';

type TransportationService = Database['public']['Tables']['transportation_services']['Row'];

interface TransportationCardProps {
  service: TransportationService;
  className?: string;
  index?: number;
}

const TransportationCard = memo(function TransportationCard({ 
  service, 
  className = '',
  index = 0
}: TransportationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPriceRangeLabel = (priceRange: string) => {
    switch (priceRange) {
      case 'low':
        return { label: 'Economical', icon: 1 };
      case 'medium':
        return { label: 'Standard', icon: 2 };
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
  
  const priceInfo = getPriceRangeLabel(service.price_range);
  
  // Only load the first few cards with priority
  const shouldPrioritize = index < 4;

  return (
    <Link 
      href={`/routes/public/transportation/${service.id}`}
      className={`group block ${className}`}
    >
      <AnimatedCard
        hoverEffect="scale"
        index={index}
        className="h-full"
      >
        <div 
          className="relative h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden sm:h-52 md:h-48 lg:h-52">
            <OptimizedImage
              src={service.images[0]}
              alt={service.name}
              fill
              sizes={getResponsiveImageSizes()}
              className={`object-cover transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              priority={shouldPrioritize}
              fallbackType="transportation"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Service type badge */}
            <div className="absolute top-3 left-3 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              {getServiceTypeLabel(service.service_type)}
            </div>
            
            {/* Price range badge */}
            <div className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm flex items-center">
              <span className="mr-1 hidden sm:inline">{priceInfo.label}</span>
              <div className="flex items-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CircleDollarSign 
                    key={i} 
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < priceInfo.icon ? 'text-primary' : 'text-muted-foreground/30'}`} 
                    aria-hidden={i >= priceInfo.icon}
                  />
                ))}
                <span className="ml-1 text-xs">KWD</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3 sm:p-4">
            <h3 className="line-clamp-1 text-base font-semibold group-hover:text-primary sm:text-lg">
              {service.name}
            </h3>
            
            <div className="mt-1 flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="line-clamp-1 text-xs sm:text-sm">{service.location}</span>
            </div>
            
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
              {service.description}
            </p>
            
            <div className="mt-3 flex flex-col space-y-1.5 border-t border-border pt-3 text-xs sm:mt-4 sm:pt-4 sm:text-sm">
              <div className="flex items-center">
                <Phone className="mr-1.5 h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                <span className="line-clamp-1">{service.contact_info}</span>
              </div>
              
              {service.website && (
                <div className="flex items-center">
                  <Globe className="mr-1.5 h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                  <span className="line-clamp-1 text-primary">{service.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
});

export default TransportationCard; 