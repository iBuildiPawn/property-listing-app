# User Roles in Property Listing App

This document outlines the user roles available in the Property Listing application and their respective permissions.

## Available Roles

The application supports three distinct user roles:

### 1. Renter

**Description:** Users looking to rent properties.

**Permissions:**
- Browse all property listings
- View property details including prices
- Save favorite properties
- Contact property owners
- Access transportation services
- Use the chatbot for assistance
- Update their profile information

### 2. Buyer

**Description:** Users looking to purchase properties.

**Permissions:**
- Browse all property listings
- View property details including prices
- Save favorite properties
- Contact property owners
- Access transportation services
- Use the chatbot for assistance
- Update their profile information

### 3. Owner

**Description:** Users who own properties and want to list them for rent or sale.

**Permissions:**
- All permissions of Renters and Buyers
- Create new property listings
- Edit their own property listings
- Delete their own property listings
- View statistics on their property listings
- Receive inquiries from potential renters/buyers

## Admin Role

In addition to the standard user roles, the application also has an admin role that is not selectable during registration.

**Permissions:**
- All permissions of all other roles
- Access to admin dashboard
- Manage all property listings (edit/delete)
- Manage all user accounts
- View application statistics
- Configure application settings

## How Roles Affect the User Experience

1. **Registration:** Users select their role during registration (Renter, Buyer, or Owner)
2. **UI Customization:** The interface adapts based on the user's role:
   - Owners see property management options
   - Renters and Buyers see property search optimized for their needs
3. **Property Listing:** Only Owners and Admins can create property listings
4. **Chatbot Interaction:** The chatbot provides personalized recommendations based on the user's role

## Changing Roles

Users can change their role from their profile settings. This allows users to switch between roles as their needs change (e.g., a Renter becoming a Buyer or an Owner).

## Implementation Details

User roles are stored in the `profiles` table in the database with the `user_type` field, which can have one of the following values:
- 'renter'
- 'buyer'
- 'owner'

The application uses Row Level Security (RLS) policies to enforce permissions based on user roles. 