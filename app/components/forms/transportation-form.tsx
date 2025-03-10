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

const transportationFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  service_type: z.enum(['moving', 'ride_sharing', 'public_transport', 'car_rental'], {
    required_error: 'Please select a service type.',
  }),
  price_range: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a price range.',
  }),
  location: z.string().min(3, {
    message: 'Location must be at least 3 characters.',
  }),
  contact_info: z.string().min(5, {
    message: 'Contact information must be at least 5 characters.',
  }),
  website: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional().or(z.literal('')),
  images: z.array(z.string()).min(1, {
    message: 'At least one image is required.',
  }),
  is_available: z.boolean().default(true),
});

type TransportationFormValues = z.infer<typeof transportationFormSchema>;

interface TransportationFormProps {
  initialData?: Partial<TransportationFormValues>;
  serviceId?: string;
}

export function TransportationForm({ initialData, serviceId }: TransportationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!serviceId;

  const form = useForm<TransportationFormValues>({
    resolver: zodResolver(transportationFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      service_type: initialData?.service_type || 'moving',
      price_range: initialData?.price_range || 'medium',
      location: initialData?.location || '',
      contact_info: initialData?.contact_info || '',
      website: initialData?.website || '',
      images: initialData?.images || [],
      is_available: initialData?.is_available !== false,
    },
  });

  const onSubmit = async (data: TransportationFormValues) => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('No user found');
      }

      const serviceData = {
        ...data,
        owner_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let response;

      if (isEditing) {
        response = await supabase
          .from('transportation_services')
          .update(serviceData)
          .eq('id', serviceId);
      } else {
        response = await supabase
          .from('transportation_services')
          .insert({
            ...serviceData,
            created_at: new Date().toISOString(),
          });
      }

      if (response.error) {
        throw response.error;
      }

      toast({
        title: isEditing ? 'Service updated' : 'Service created',
        description: isEditing
          ? 'Your transportation service has been updated successfully.'
          : 'Your transportation service has been created successfully.',
      });

      router.push('/routes/dashboard/transportation');
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
          {isEditing ? 'Edit Transportation Service' : 'Add New Transportation Service'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isEditing
            ? 'Update your transportation service information.'
            : 'Create a new transportation service listing.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Service name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your transportation service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moving">Moving</SelectItem>
                      <SelectItem value="ride_sharing">Ride Sharing</SelectItem>
                      <SelectItem value="public_transport">Public Transport</SelectItem>
                      <SelectItem value="car_rental">Car Rental</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a price range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Service location" {...field} />
                  </FormControl>
                  <FormDescription>
                    The area where your service operates.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact information" {...field} />
                  </FormControl>
                  <FormDescription>
                    Phone number, email, or other contact details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your service's website (optional).
                  </FormDescription>
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
                      Is this service currently available?
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
                    placeholder="Describe your transportation service"
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    bucket={StorageBucket.TRANSPORTATION_IMAGES}
                    onUpload={handleImagesUpload}
                    multiple={true}
                    maxFiles={5}
                    initialImages={field.value}
                    customPath="services"
                  />
                </FormControl>
                <FormDescription>
                  Upload up to 5 images of your transportation service.
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
              ? 'Update Service'
              : 'Create Service'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 