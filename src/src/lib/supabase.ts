import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey as infoKey } from '../../utils/supabase/info';

const getSupabaseConfig = () => {
  let url = '';
  let key = '';

  // Try import.meta.env safely
  try {
    // Check if import.meta.env exists before accessing properties
    // @ts-ignore
    if (import.meta && import.meta.env) {
      // @ts-ignore
      url = import.meta.env.VITE_SUPABASE_URL;
      // @ts-ignore
      key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
  } catch (e) {
    // Ignore error if import.meta is not available
  }

  // Fallback to info.tsx if env vars are missing
  if (!url && projectId) url = `https://${projectId}.supabase.co`;
  if (!key && infoKey) key = infoKey;

  return { url, key };
};

const { url, key } = getSupabaseConfig();

if (!url || !key) {
  console.error("Missing Supabase environment variables and info.tsx fallback");
}

export const supabase = createClient(url || '', key || '', {
  auth: { persistSession: true, autoRefreshToken: true },
});
