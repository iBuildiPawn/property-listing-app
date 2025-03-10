'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/app/types/database.types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { toast } from '@/app/components/ui/use-toast';
import { Loader2, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type TransportationService = Database['public']['Tables']['transportation_services']['Row'];

export function TransportationManagement() {
  const [services, setServices] = useState<TransportationService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from('transportation_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching transportation services',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setServices(data || []);
    }
    setLoading(false);
  }

  async function toggleServiceAvailability(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('transportation_services')
      .update({ is_available: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating service',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Service updated',
        description: `Service is now ${!currentStatus ? 'available' : 'unavailable'}`,
      });
      fetchServices();
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Are you sure you want to delete this transportation service?')) return;

    const { error } = await supabase
      .from('transportation_services')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting service',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Service deleted',
        description: 'The transportation service has been deleted successfully',
      });
      fetchServices();
    }
  }

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transportation services..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/routes/transportation/new">
          <Button>Add New Service</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No transportation services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="capitalize">{service.service_type.replace('_', ' ')}</TableCell>
                    <TableCell>{service.location}</TableCell>
                    <TableCell className="capitalize">{service.price_range}</TableCell>
                    <TableCell>
                      <Badge variant={service.is_available ? "success" : "secondary"}>
                        {service.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleServiceAvailability(service.id, service.is_available)}
                        title={service.is_available ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {service.is_available ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/routes/transportation/edit/${service.id}`}>
                        <Button variant="outline" size="icon" title="Edit service">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteService(service.id)}
                        title="Delete service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 