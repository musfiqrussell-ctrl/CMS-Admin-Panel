import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

const STORAGE_KEY_URL = 'portfolio_supabase_url';
const STORAGE_KEY_KEY = 'portfolio_supabase_anon_key';

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const customKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  const url = customUrl || envUrl;
  const anonKey = customKey || envKey;

  const isConfigured = Boolean(
    url && 
    url.startsWith('https://') && 
    url.includes('.supabase.co') && 
    anonKey && 
    anonKey.length > 20 &&
    !url.includes('your-project')
  );

  return { url, anonKey, isConfigured };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

export function resetSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

const config = getSupabaseConfig();
const fallbackUrl = config.url || 'https://placeholder.supabase.co';
const fallbackKey = config.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase: SupabaseClient = createClient(fallbackUrl, fallbackKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function getFreshSupabaseClient(): SupabaseClient {
  const current = getSupabaseConfig();
  if (current.isConfigured) {
    return createClient(current.url, current.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }
  return supabase;
}
