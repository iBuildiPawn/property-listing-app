"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import PropertyCard from '@/app/components/properties/property-card';
import { Database } from '@/app/types/database.types';
import { useAuth } from '@/app/contexts/auth-context';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Home, 
  Building, 
  Warehouse, 
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  MotionWrapper, 
  StaggerContainer, 
  AnimatedButton 
} from '@/app/components/animations';

type Property = Database['public']['Tables']['properties']['Row'];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [bedroomsMin, setBedroomsMin] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [properties, searchQuery, propertyType, priceRange, bedroomsMin]);
  
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true);
        
      if (error) {
        throw error;
      }
      
      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchFavorites = async () => {
    try {
      // This is a placeholder for fetching user favorites
      // In a real app, you would have a favorites table
      setFavorites([]);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
    }
  };
  
  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
    
    // In a real app, you would update the favorites in the database
  };
  
  const applyFilters = () => {
    let filtered = [...properties];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
      );
    }
    
    // Apply property type filter
    if (propertyType !== 'all') {
      filtered = filtered.filter(property => 
        property.property_type === propertyType
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );
    
    // Apply bedrooms filter
    if (bedroomsMin !== null) {
      filtered = filtered.filter(property => 
        property.bedrooms >= bedroomsMin
      );
    }
    
    setFilteredProperties(filtered);
  };
  
  const propertyTypes = [
    { value: 'all', label: 'All Types', icon: Home },
    { value: 'apartment', label: 'Apartments', icon: Building },
    { value: 'house', label: 'Villas', icon: Home },
    { value: 'condo', label: 'Penthouses', icon: Building },
    { value: 'townhouse', label: 'Townhouses', icon: Home },
    { value: 'land', label: 'Land', icon: Warehouse },
  ];
  
  const bedroomOptions = [
    { value: null, label: 'Any' },
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <MotionWrapper variant="fade" className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kuwait Properties</h1>
        <p className="text-muted-foreground">
          Find your dream property in Kuwait with our comprehensive listings.
        </p>
      </MotionWrapper>
      
      <MotionWrapper variant="slide" direction="up" delay={0.1} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Filter button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </MotionWrapper>
      
      {/* Filter panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isFilterOpen ? 'auto' : 0,
          opacity: isFilterOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Property Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPropertyType(type.value)}
                  className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-medium ${
                    propertyType === type.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  aria-pressed={propertyType === type.value}
                >
                  <type.icon className="h-3 w-3" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Price Range (KWD)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={priceRange[0] || ''}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                aria-label="Minimum price in KWD"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={priceRange[1] || ''}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000000])}
                aria-label="Maximum price in KWD"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Bedrooms</label>
            <div className="flex gap-2">
              {bedroomOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setBedroomsMin(option.value)}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium ${
                    bedroomsMin === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  aria-pressed={bedroomsMin === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Properties grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : filteredProperties.length === 0 ? (
        <MotionWrapper variant="fade" className="text-center py-12">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query to find properties.
            </p>
          </div>
        </MotionWrapper>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={user ? toggleFavorite : undefined}
              index={index}
            />
          ))}
        </StaggerContainer>
      )}
    </div>
  );
} 