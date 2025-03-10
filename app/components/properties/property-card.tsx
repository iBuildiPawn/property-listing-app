import Image from 'next/image';
import Link from 'next/link';
import { Database } from '@/app/types/database.types';
import { Heart, BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { useState, memo } from 'react';
import { generateBlurPlaceholder, getResponsiveImageSizes, getPlaceholderImage } from '@/app/utils/image-optimization';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  className?: string;
  index?: number;
}

const PropertyCard = memo(function PropertyCard({ 
  property, 
  isFavorite = false, 
  onToggleFavorite,
  className = '',
  index = 0
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const formatPrice = (price: number) => {
    return price >= 1000 
      ? `${(price / 1000).toFixed(1)}K KWD` 
      : `${price} KWD`;
  };
  
  const formatPriceWithCommas = (price: number) => {
    return `${price.toLocaleString()} KWD`;
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  const imageSrc = imageError || !property.images[0] 
    ? getPlaceholderImage('property')
    : property.images[0];

  // Only load the first few cards with priority
  const shouldPrioritize = index < 4;

  return (
    <Link 
      href={`/routes/public/properties/${property.id}`}
      className={`group block transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      <div 
        className="relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden sm:h-52 md:h-48 lg:h-52">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes={getResponsiveImageSizes()}
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            priority={shouldPrioritize}
            loading={shouldPrioritize ? 'eager' : 'lazy'}
            onError={() => setImageError(true)}
            blurDataURL={generateBlurPlaceholder()}
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Price tag */}
          <div className="absolute bottom-3 left-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground sm:text-sm">
            {property.property_type === 'apartment' || property.property_type === 'condo' 
              ? `${formatPrice(property.price)}/mo` 
              : formatPriceWithCommas(property.price)}
          </div>
          
          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute right-3 top-3 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
              />
            </button>
          )}
          
          {/* Property type badge */}
          <div className="absolute right-3 bottom-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium capitalize backdrop-blur-sm">
            {property.property_type}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-1 text-base font-semibold group-hover:text-primary sm:text-lg">
            {property.title}
          </h3>
          
          <div className="mt-1 flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1 text-xs sm:text-sm">{property.location}</span>
          </div>
          
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            {property.description}
          </p>
          
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 sm:mt-4 sm:pt-4">
            <div className="flex items-center space-x-3 text-xs sm:space-x-4 sm:text-sm">
              <div className="flex items-center">
                <BedDouble className="mr-1 h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="mr-1 h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="mr-1 h-3 w-3 text-muted-foreground sm:h-4 sm:w-4" />
                <span>{property.size} m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default PropertyCard; 