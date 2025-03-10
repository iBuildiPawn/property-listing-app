export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          email: string
          user_type: 'renter' | 'buyer' | 'owner' | null
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          user_type?: 'renter' | 'buyer' | 'owner' | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          user_type?: 'renter' | 'buyer' | 'owner' | null
          is_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          price: number
          location: string
          property_type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land'
          bedrooms: number
          bathrooms: number
          size: number
          amenities: string[]
          images: string[]
          is_available: boolean
          owner_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          price: number
          location: string
          property_type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land'
          bedrooms: number
          bathrooms: number
          size: number
          amenities: string[]
          images: string[]
          is_available?: boolean
          owner_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          price?: number
          location?: string
          property_type?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land'
          bedrooms?: number
          bathrooms?: number
          size?: number
          amenities?: string[]
          images?: string[]
          is_available?: boolean
          owner_id?: string | null
        }
      }
      transportation_services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          service_type: 'moving' | 'ride_sharing' | 'public_transport' | 'car_rental'
          price_range: 'low' | 'medium' | 'high'
          location: string
          contact_info: string
          website: string | null
          images: string[]
          is_available: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          service_type: 'moving' | 'ride_sharing' | 'public_transport' | 'car_rental'
          price_range: 'low' | 'medium' | 'high'
          location: string
          contact_info: string
          website?: string | null
          images: string[]
          is_available?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          service_type?: 'moving' | 'ride_sharing' | 'public_transport' | 'car_rental'
          price_range?: 'low' | 'medium' | 'high'
          location?: string
          contact_info?: string
          website?: string | null
          images?: string[]
          is_available?: boolean
        }
      }
      user_preferences: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          property_type: string[]
          price_min: number | null
          price_max: number | null
          bedrooms_min: number | null
          bathrooms_min: number | null
          size_min: number | null
          preferred_locations: string[]
          preferred_amenities: string[]
          transportation_preferences: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          property_type?: string[]
          price_min?: number | null
          price_max?: number | null
          bedrooms_min?: number | null
          bathrooms_min?: number | null
          size_min?: number | null
          preferred_locations?: string[]
          preferred_amenities?: string[]
          transportation_preferences?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          property_type?: string[]
          price_min?: number | null
          price_max?: number | null
          bedrooms_min?: number | null
          bathrooms_min?: number | null
          size_min?: number | null
          preferred_locations?: string[]
          preferred_amenities?: string[]
          transportation_preferences?: string[]
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          messages: Json[]
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          messages?: Json[]
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          messages?: Json[]
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 