import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/app/contexts/auth-context';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useToast } from '@/app/components/ui/use-toast';
import { ImageUpload } from '@/app/components/ui/image-upload';
import { StorageBucket } from '@/app/utils/storage-helpers';

const propertyFormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  location: z.string().min(5, {
    message: 'Location must be at least 5 characters.',
  }),
  property_type: z.enum(['apartment', 'house', 'condo', 'townhouse', 'land'], {
    required_error: 'Please select a property type.',
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: 'Bedrooms must be a non-negative integer.',
  }),
  bathrooms: z.coerce.number().min(0, {
    message: 'Bathrooms must be a non-negative number.',
  }),
  size: z.coerce.number().positive({
    message: 'Size must be a positive number.',
  }),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, {
    message: 'At least one image is required.',
  }),
  is_available: z.boolean().default(true),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

// Available amenities
const amenitiesOptions = [
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'parking', label: 'Parking' },
  { id: 'security', label: 'Security' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'garden', label: 'Garden' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'garage', label: 'Garage' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
  { id: 'waterfront', label: 'Waterfront' },
  { id: 'air_conditioning', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'washer_dryer', label: 'Washer/Dryer' },
  { id: 'furnished', label: 'Furnished' },
];

interface PropertyFormProps {
  initialData?: Partial<PropertyFormValues>;
  propertyId?: string;
}

export function PropertyForm({ initialData, propertyId }: PropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!propertyId;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      location: initialData?.location || '',
      property_type: initialData?.property_type || 'apartment',
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      size: initialData?.size || 0,
      amenities: initialData?.amenities || [],
      images: initialData?.images || [],
      is_available: initialData?.is_available !== false,
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('No user found');
      }

      const propertyData = {
        ...data,
        owner_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let response;

      if (isEditing) {
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);
      } else {
        response = await supabase
          .from('properties')
          .insert({
            ...propertyData,
            created_at: new Date().toISOString(),
          });
      }

      if (response.error) {
        throw response.error;
      }

      toast({
        title: isEditing ? 'Property updated' : 'Property created',
        description: isEditing
          ? 'Your property has been updated successfully.'
          : 'Your property has been created successfully.',
      });

      router.push('/routes/dashboard/properties');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesUpload = (urls: string[]) => {
    form.setValue('images', urls, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {isEditing ? 'Edit Property' : 'Add New Property'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? 'Update your property listing information.'
            : 'Create a new property listing.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Property title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A catchy title for your property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Property location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of bedrooms"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of bathrooms"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      step="0.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (sq ft)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Property size"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available</FormLabel>
                    <FormDescription>
                      Is this property currently available?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your property"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Amenities</FormLabel>
                  <FormDescription>
                    Select the amenities available at this property.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenitiesOptions.map((amenity) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={amenity.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([
                                        ...currentValue,
                                        amenity.id,
                                      ])
                                    : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== amenity.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {amenity.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    bucket={StorageBucket.PROPERTY_IMAGES}
                    onUpload={handleImagesUpload}
                    multiple={true}
                    maxFiles={5}
                    initialImages={field.value}
                    customPath={user?.id}
                  />
                </FormControl>
                <FormDescription>
                  Upload up to 5 images of your property.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
              ? 'Update Property'
              : 'Create Property'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 