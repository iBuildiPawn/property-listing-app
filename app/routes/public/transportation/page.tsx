"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import TransportationCard from '@/app/components/transportation/transportation-card';
import { Database } from '@/app/types/database.types';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Truck, 
  Car, 
  Bus, 
  MapPin,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  MotionWrapper, 
  StaggerContainer, 
  AnimatedButton 
} from '@/app/components/animations';

type TransportationService = Database['public']['Tables']['transportation_services']['Row'];

export default function TransportationPage() {
  const [services, setServices] = useState<TransportationService[]>([]);
  const [filteredServices, setFilteredServices] = useState<TransportationService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceType, setServiceType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [services, searchQuery, serviceType, priceRange]);
  
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transportation_services')
        .select('*')
        .eq('is_available', true);
        
      if (error) {
        throw error;
      }
      
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transportation services:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...services];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query)
      );
    }
    
    // Apply service type filter
    if (serviceType !== 'all') {
      filtered = filtered.filter(service => 
        service.service_type === serviceType
      );
    }
    
    // Apply price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(service => 
        service.price_range === priceRange
      );
    }
    
    setFilteredServices(filtered);
  };
  
  const serviceTypes = [
    { value: 'all', label: 'All Types', icon: Truck },
    { value: 'moving', label: 'Moving', icon: Truck },
    { value: 'ride_sharing', label: 'Ride Sharing', icon: Car },
    { value: 'public_transport', label: 'Public Transport', icon: Bus },
    { value: 'car_rental', label: 'Car Rental', icon: Car },
  ];
  
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Economical' },
    { value: 'medium', label: 'Standard' },
    { value: 'high', label: 'Premium' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <MotionWrapper variant="fade" className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kuwait Transportation Services</h1>
        <p className="text-muted-foreground">
          Find reliable transportation services in Kuwait for all your needs.
        </p>
      </MotionWrapper>
      
      <MotionWrapper variant="slide" direction="up" delay={0.1} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Service Type</label>
            <div className="grid grid-cols-3 gap-2">
              {serviceTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setServiceType(type.value)}
                  className={`flex items-center justify-center gap-1 rounded-md px-3 py-2 text-xs font-medium ${
                    serviceType === type.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <type.icon className="h-3 w-3" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Price Range</label>
            <div className="grid grid-cols-4 gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setPriceRange(range.value)}
                  className={`rounded-md px-3 py-2 text-xs font-medium ${
                    priceRange === range.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Services grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : filteredServices.length === 0 ? (
        <MotionWrapper variant="fade" className="text-center py-12">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query to find transportation services.
            </p>
          </div>
        </MotionWrapper>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <TransportationCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </StaggerContainer>
      )}
    </div>
  );
} 