import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Constants.expoConfig?.extra?.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('SUPABASE_URL or SUPABASE_ANON_KEY is missing. Define them in app/app.json under expo.extra.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
});
