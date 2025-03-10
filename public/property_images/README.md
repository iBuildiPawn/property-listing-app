# Kuwait Property Images

This directory contains property images for the Kuwait-specific property listings. These images need to be uploaded to your Supabase storage bucket for the property listings to display correctly.

## Uploading to Supabase

Follow these steps to upload the images to your Supabase storage bucket:

1. **Log in to your Supabase dashboard**
   - Go to https://app.supabase.com/ and log in to your account
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - If you don't already have a bucket named "property_images", create one:
     - Click "New Bucket"
     - Name it "property_images"
     - Set the privacy to "Public" (so images can be viewed without authentication)
     - Click "Create bucket"

3. **Upload the images**
   - Click on the "property_images" bucket
   - Click "Upload" button
   - Select all the images from this directory
   - Click "Upload" to start the upload process

4. **Verify the uploads**
   - After uploading, you should see all the images listed in the bucket
   - The image URLs will be in the format:
     `/storage/v1/object/public/property_images/filename.jpg`

5. **Run the SQL script**
   - After uploading the images, run the SQL script at `db/migrations/insert_kuwait_properties.sql`
   - This will insert the property listings with references to the uploaded images

## Image Attribution

The images in this directory are sourced from Unsplash and are used for demonstration purposes only. In a production environment, you should use properly licensed images or your own photographs.

## Troubleshooting

If images don't appear in your application:

1. Check that the images were uploaded to the correct bucket
2. Verify that the bucket is set to "Public"
3. Ensure the image paths in the SQL script match the actual paths in your Supabase storage
4. Check the browser console for any errors related to image loading 