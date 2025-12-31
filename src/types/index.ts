
// Defines the shape of the user profile object
export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'patient' | 'doctor';
  phone?: string;

  // Doctor-specific fields
  specialization?: string;
  license_number?: string;
  status?: string; // e.g., 'pending_profile', 'active'
}
