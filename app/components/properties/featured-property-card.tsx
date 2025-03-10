'use client';

import Link from 'next/link';
import { Database } from '@/app/types/database.types';
import { BedDouble, Bath, Square, MapPin, Lock } from 'lucide-react';
import { useState, memo } from 'react';
import { getResponsiveImageSizes } from '@/app/utils/image-optimization';
import OptimizedImage from '@/app/components/ui/optimized-image';
import { AnimatedCard } from '@/app/components/animations';
import { Button } from '@/app/components/ui/button';

type Property = Database['public']['Tables']['properties']['Row'];

interface FeaturedPropertyCardProps {
  property: Property;
  isAuthenticated: boolean;
  className?: string;
  index?: number;
}

const FeaturedPropertyCard = memo(function FeaturedPropertyCard({ 
  property, 
  isAuthenticated,
  className = '',
  index = 0
}: FeaturedPropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatPrice = (price: number) => {
    return price >= 1000 
      ? `${(price / 1000).toFixed(1)}K KWD` 
      : `${price} KWD`;
  };
  
  const formatPriceWithCommas = (price: number) => {
    return `${price.toLocaleString()} KWD`;
  };

  // Only load the first few cards with priority
  const shouldPrioritize = index < 4;

  return (
    <AnimatedCard
      hoverEffect="lift"
      index={index}
      className={`h-full ${className}`}
    >
      <div 
        className="relative h-full overflow-hidden rounded-lg border border-border bg-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden sm:h-52 md:h-60 lg:h-64">
          <OptimizedImage
            src={property.images[0]}
            alt={property.title}
            fill
            sizes={getResponsiveImageSizes()}
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            priority={shouldPrioritize}
            fallbackType="property"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Price tag - only shown if authenticated */}
          {isAuthenticated ? (
            <div className="absolute bottom-3 left-3 rounded-md bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground">
              {property.property_type === 'apartment' || property.property_type === 'condo' 
                ? `${formatPrice(property.price)}/mo` 
                : formatPriceWithCommas(property.price)}
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 rounded-md bg-muted px-2 py-1 text-sm font-semibold flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              <span>Login to view price</span>
            </div>
          )}
          
          {/* Property type badge */}
          <div className="absolute right-3 bottom-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium capitalize backdrop-blur-sm">
            {property.property_type}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary sm:text-xl">
            {property.title}
          </h3>
          
          <div className="mt-1 flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="line-clamp-1 text-sm">{property.location}</span>
          </div>
          
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {property.description}
          </p>
          
          <div className="mt-4 flex items-center space-x-4 text-sm border-t border-border pt-4">
            <div className="flex items-center">
              <BedDouble className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{property.size} m²</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link href={`/routes/public/properties/${property.id}`}>
              <Button variant="default" size="sm">
                View Details
              </Button>
            </Link>
            
            {!isAuthenticated && (
              <Link href="/routes/auth/login">
                <Button variant="outline" size="sm">
                  Login to see price
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
});

export default FeaturedPropertyCard; 