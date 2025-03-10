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

type Property = Database['public']['Tables']['properties']['Row'];

export function PropertiesManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching properties',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  }

  async function togglePropertyAvailability(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('properties')
      .update({ is_available: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error updating property',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Property updated',
        description: `Property is now ${!currentStatus ? 'available' : 'unavailable'}`,
      });
      fetchProperties();
    }
  }

  async function deleteProperty(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting property',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Property deleted',
        description: 'The property has been deleted successfully',
      });
      fetchProperties();
    }
  }

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/routes/properties/new">
          <Button>Add New Property</Button>
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
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No properties found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell className="capitalize">{property.property_type}</TableCell>
                    <TableCell>{property.price} KWD</TableCell>
                    <TableCell>
                      <Badge variant={property.is_available ? "success" : "secondary"}>
                        {property.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => togglePropertyAvailability(property.id, property.is_available)}
                        title={property.is_available ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {property.is_available ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/routes/properties/edit/${property.id}`}>
                        <Button variant="outline" size="icon" title="Edit property">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteProperty(property.id)}
                        title="Delete property"
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