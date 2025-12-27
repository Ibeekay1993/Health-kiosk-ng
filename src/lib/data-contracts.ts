
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Represents the public profile data for a user, sourced from the `profiles` table.
 * This is the single source of truth for UI components.
 */
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  medical_history: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents the authenticated user from Supabase Auth.
 */
export type User = SupabaseUser;
