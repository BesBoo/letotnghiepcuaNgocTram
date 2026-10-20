import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Guest {
  id?: number | string;
  slug: string;
  name: string;
  greeting?: string;
  custom_message?: string;
  has_opened?: boolean;
  opened_at?: string;
  rsvp_status?: 'attending' | 'declined' | 'pending';
  rsvp_note?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
