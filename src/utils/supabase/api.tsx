import { supabase } from '../../src/lib/supabase';
import { projectId } from './info';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Profile {
  id: string; // uuid, auth.users.id
  email: string;
  full_name: string;
  avatar_url?: string;
  username?: string;
  bio?: string;
  website?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  code: string; // 'free' | 'pro' | 'business'
  name: string;
  price_monthly: number; // Computed from price_monthly_cents
  price_monthly_cents: number;
  currency: string;
  description?: string;
  links_limit: number;
  qr_limit: number;
  custom_domains_limit: number;
  team_members_limit: number;
  analytics_retention_days: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan?: Plan; // Joined field
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  original_url: string;
  status: 'active' | 'archived' | 'disabled';
  is_active: boolean;
  type?: string; // 'url' | 'link_in_bio'
  expiration_date?: string;
  click_limit?: number;
  password_hash?: string;
  position: number;
  created_at: string;
  updated_at: string;
  // Computed/Joined
  clicks?: number;
}

export interface LinkAnalytics {
  id: string;
  link_id: string;
  clicked_at: string;
  referrer: string;
  device_type: string;
  browser: string;
  os: string;
  country: string;
}

export interface QRCode {
  id: string;
  user_id: string;
  link_id?: string;
  name: string;
  target_url: string;
  qr_image_url?: string;
  style: any; // JSONB
  created_at: string;
  updated_at: string;
}

// ============================================
// EDGE FUNCTIONS HELPER
// ============================================

const invokeEdgeFunction = async (functionName: string, body: any = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Get Supabase URL safely
  let supabaseUrl = '';
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
      // @ts-ignore
      supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    }
  } catch (e) {
    // ignore
  }

  if (!supabaseUrl && projectId) {
    supabaseUrl = `https://${projectId}.supabase.co`;
  }

  if (!supabaseUrl) {
    throw new Error('Supabase URL is missing');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Don't throw for 404/500 to allow UI to handle gracefully if needed, 
    // but better to throw so caller knows it failed.
    throw new Error(`Edge Function ${functionName} failed: ${errorText}`);
  }

  return response.json();
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  async signUp(email: string, password: string, fullName: string) {
    // Signup creates auth user. Database trigger automatically creates profile row.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { data, error };
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async updateUser(attributes: any) {
    const { data, error } = await supabase.auth.updateUser(attributes);
    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    return await supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ============================================
// PROFILES API
// ============================================

export const profilesAPI = {
  async getProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    return await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();
  },

  async uploadAvatar(userId: string, file: File) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
         // Fallback to link_bio_assets if avatars bucket doesn't exist
         // But usually creating a bucket via code is not possible here.
         // We'll throw and let UI handle or try alternate bucket
         console.warn("Avatar bucket might not exist, trying link_bio_assets");
         return this.uploadAvatarFallback(userId, file);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { publicUrl, error: null };
  },

  async uploadAvatarFallback(userId: string, file: File) {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('link_bio_assets')
        .upload(filePath, file, { upsert: true });
        
      if(error) return { publicUrl: null, error };
      
      const { data: { publicUrl } } = supabase.storage
        .from('link_bio_assets')
        .getPublicUrl(filePath);
        
      return { publicUrl, error: null };
  },
};

// ============================================
// PLANS & SUBSCRIPTIONS API
// ============================================

export const plansAPI = {
  async getAllPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_monthly_cents', { ascending: true });

    if (error) return { data: null, error };
    if (!data) return { data: [], error: null };

    // Transform price_monthly_cents to price_monthly
    const transformedData = data.map((plan: any) => ({
      ...plan,
      price_monthly: plan.price_monthly_cents / 100,
    }));

    return { data: transformedData, error: null };
  },

  async getPlan(planId: string) {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) return { data: null, error };
    if (!data) return { data: null, error: null };

    const transformedData = {
      ...data,
      price_monthly: data.price_monthly_cents / 100,
    };

    return { data: transformedData, error: null };
  },
};

export const subscriptionsAPI = {
  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return { data: null, error };
    if (!data) return { data: null, error: null };

    // Transform plan inside subscription
    if (data.plan) {
      data.plan.price_monthly = data.plan.price_monthly_cents / 100;
    }

    return { data, error: null };
  },

  // Calls Edge Function to create checkout session
  async createCheckoutSession(priceId: string) {
    return await invokeEdgeFunction('stripe-checkout', { priceId });
  },

  // Calls Edge Function to open customer portal
  async createPortalSession() {
    return await invokeEdgeFunction('stripe-portal', {});
  },
};

// ============================================
// LINKS API
// ============================================

export const linksAPI = {
  async getUserLinks(userId: string) {
    return await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });
  },

  async createLink(link: Partial<Link>) {
    // Get max position to append to end
    // Note: Concurrency issue possible here, but acceptable for this use case
    const { data: maxPosData } = await supabase
      .from('links')
      .select('position')
      .eq('user_id', link.user_id)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const newPosition = (maxPosData?.position ?? -1) + 1;

    return await supabase
      .from('links')
      .insert({
        ...link,
        position: newPosition,
        status: 'active',
        is_active: true,
      })
      .select()
      .single();
  },

  async updateLink(linkId: string, updates: Partial<Link>) {
    return await supabase
      .from('links')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', linkId)
      .select()
      .single();
  },

  async deleteLink(linkId: string) {
    return await supabase
      .from('links')
      .delete()
      .eq('id', linkId);
  },

  async reorderLinks(linkIds: string[]) {
    // Naive implementation for reordering
    // Ideally should be a stored procedure
    const updates = linkIds.map((id, index) => 
      supabase
        .from('links')
        .update({ position: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    );
    
    await Promise.all(updates);
    return { error: null };
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsAPI = {
  async getLinkAnalytics(linkId: string) {
    return await supabase
      .from('link_analytics')
      .select('*')
      .eq('link_id', linkId)
      .order('clicked_at', { ascending: false });
  },

  async getUserGlobalAnalytics(userId: string) {
    // Fetch analytics for all user links
    // First get user links
    const { data: links } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', userId);
      
    if (!links || links.length === 0) return { data: [], error: null };
    
    const linkIds = links.map((l: any) => l.id);
    
    // Then get analytics
    return await supabase
      .from('link_analytics')
      .select('*')
      .in('link_id', linkIds)
      .order('clicked_at', { ascending: false });
  },

  async getUserLinksClickCount(userId: string) {
     // First get user links
     const { data: links } = await supabase
       .from('links')
       .select('id')
       .eq('user_id', userId);
       
     if (!links || links.length === 0) return { data: {}, error: null };
     
     const linkIds = links.map((l: any) => l.id);
     
     // Fetch all clicks for these links
     const { data, error } = await supabase
       .from('link_analytics')
       .select('link_id')
       .in('link_id', linkIds);
       
     if (error) return { data: null, error };
     
     const counts: Record<string, number> = {};
     data?.forEach((row: any) => {
       counts[row.link_id] = (counts[row.link_id] || 0) + 1;
     });
     
     return { data: counts, error: null };
  }
};

// ============================================
// QR CODES API
// ============================================

export const qrCodesAPI = {
  async getUserQRCodes(userId: string) {
    return await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async createQRCode(qrCode: Partial<QRCode>) {
    // 1. Create row
    const { data, error } = await supabase
      .from('qr_codes')
      .insert(qrCode)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create QR code row');

    // 2. Call Edge Function to generate image
    try {
      await invokeEdgeFunction('generate-qr', { qr_code_id: data.id });
      
      // 3. Fetch updated row (which should have qr_image_url set by edge function)
      // We might need a small delay or retry here if EF is async, but usually it's fast enough.
      // Or we just return the row and let UI refresh later.
      return await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', data.id)
        .single();
    } catch (err) {
      console.error('Edge function error:', err);
      // Return the created row anyway
      return { data, error: null };
    }
  },

  async updateQRCode(qrCodeId: string, updates: Partial<QRCode>) {
    return await supabase
      .from('qr_codes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', qrCodeId)
      .select()
      .single();
  },

  async deleteQRCode(qrCodeId: string) {
    return await supabase
      .from('qr_codes')
      .delete()
      .eq('id', qrCodeId);
  },
};

// ============================================
// STUBS FOR MISSING TABLES (Teams, Billing)
// ============================================

export interface Team {
  id: string;
  owner_id: string;
  team_name: string;
  plan_id: string;
  created_at: string;
  updated_at: string;
}

export interface BillingHistory {
  id: string;
  user_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded';
  invoice_url: string;
  created_at: string;
}

export const teamsAPI = {
  async getUserTeams(userId: string) {
    // 1. Try to find a team where the user is a member
    const { data: memberships, error } = await supabase
      .from('team_members')
      .select('team_id, teams(id, name)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user teams:', error);
      return { data: [], error };
    }

    // Extract teams from memberships
    const teams = memberships
      ?.map((m: any) => m.teams)
      .filter((t: any) => t !== null) || [];

    return { data: teams, error: null };
  },

  async getTeamMembers(teamId: string) {
    // Join with profiles to get name/email/avatar
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        profile:profiles(id, full_name, email, avatar_url)
      `)
      .eq('team_id', teamId);

    return { data, error };
  },

  async getPendingInvites(teamId: string) {
    const { data, error } = await supabase
      .from('team_invites')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'pending') // Assuming there's a status column, or we just fetch all
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async inviteMember(teamId: string, email: string, role: 'owner' | 'editor' | 'viewer') {
    // Deprecated: use inviteMemberEdge
    return this.inviteMemberEdge(teamId, email, role);
  },

  async inviteMemberEdge(teamId: string, email: string, role: 'owner' | 'editor' | 'viewer') {
    return await invokeEdgeFunction('make-server-ed641689/team-invite', {
        team_id: teamId,
        email,
        role
    });
  },

  async acceptInviteEdge(token: string) {
    return await invokeEdgeFunction('make-server-ed641689/team-accept', { token });
  },

  async deleteInvite(inviteId: string) {
      return await supabase.from('team_invites').delete().eq('id', inviteId);
  },

  async removeMember(userId: string, teamId: string) {
      return await supabase.from('team_members').delete().match({ user_id: userId, team_id: teamId });
  }
};

export const billingAPI = {
  async getBillingHistory(userId: string) {
    // Not implemented in this version
    return { data: [] as BillingHistory[], error: null };
  },
};

export interface BioTheme {
  id: string; // unique id for the preset or 'custom'
  name: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  buttonStyle: 'rounded' | 'pill' | 'square' | 'shadow';
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: 'inter' | 'poppins' | 'dm_sans' | 'playfair';
  animationStyle: 'none' | 'fade' | 'slide' | 'scale';
}

export const themesAPI = {
  async getTheme(userId: string) {
    // Prompt says: "By default, there is only one table in the Postgres database called kv_store_ed641689"
    // We must use this specific table name.
    const tableName = 'kv_store_ed641689'; 
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('value')
        .eq('key', `theme:${userId}`)
        .maybeSingle();

      if (error) {
        // Fallback or ignore if table doesn't exist (graceful degradation)
        console.warn('Theme KV fetch error:', error);
        return { data: null, error };
      }
      return { data: data?.value as BioTheme | null, error: null };
    } catch (e) {
      console.warn('Theme fetch failed', e);
      return { data: null, error: e };
    }
  },

  async saveTheme(userId: string, theme: BioTheme) {
    const tableName = 'kv_store_ed641689';
    
    try {
      const { error } = await supabase
        .from(tableName)
        .upsert({ 
          key: `theme:${userId}`, 
          value: theme 
        });
        
      return { error };
    } catch (e) {
      return { error: e };
    }
  }
};

// ============================================
// LINK IN BIO SPECIFIC TYPES
// ============================================

export interface LinkBioPage {
  id: string;
  user_id: string;
  username: string; // The slug
  // title column does not exist in DB schema based on error
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  link_bio_theme_settings?: LinkBioTheme; // Joined
}

export interface LinkBioLink {
  id: string;
  page_id: string;
  title: string;
  url: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  
  // Updated fields per request
  icon_key?: string; // 'instagram', 'youtube', etc.
  icon_url?: string; // Public URL from Storage
}

export interface LinkBioTheme {
  id: string;
  page_id: string;
  
  // Background
  background_type: 'solid' | 'gradient' | 'image' | 'video';
  background_value: string; // Color or Gradient string
  bg_image_url?: string;
  bg_blur?: number; // 0-20
  bg_opacity?: number; // 0-100
  bg_overlay_color?: string;
  bg_overlay_opacity?: number; // 0-100

  // Typography
  font_family: 'inter' | 'poppins' | 'dm_sans' | 'playfair' | 'satoshi' | 'outfit';
  font_size?: number; // px
  font_weight?: number; // 300-800
  text_color?: string;

  // Buttons
  button_style: 'solid' | 'outline' | 'glass' | 'neon' | 'rounded' | 'pill' | 'square' | 'shadow'; // Added new styles, kept old for back-compat if needed
  button_color: string;
  button_text_color: string;
  button_radius?: number; // px
  button_padding_y?: number;
  button_padding_x?: number;
  button_bg?: string; // Explicit override if needed, otherwise button_color
  button_border_color?: string;
  button_shadow?: number; // 0-20
  button_hover_effect?: 'none' | 'lift' | 'glow' | 'invert';

  // Branding
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  show_avatar?: boolean;

  // SEO
  seo_title?: string;
  seo_description?: string;

  // Layout
  page_width?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
  spacing?: number;
  show_link_icons?: boolean;
  open_in_new_tab?: boolean;

  // Effects
  entrance_animation?: 'none' | 'fade' | 'slide' | 'pop';
  reduce_motion_respects_os?: boolean;

  // Social
  social_links?: { platform: string; url: string }[];
  show_social_icons?: boolean;
  social_icon_style?: 'mono' | 'colored' | 'glass';

  created_at: string;
  updated_at: string;
}

// ============================================
// LINK IN BIO API
// ============================================

export const linkBioAPI = {
  // --- PAGE ---
  async getPages(userId: string) {
    return await supabase
      .from('link_bio_pages')
      .select('*, link_bio_theme_settings!link_bio_theme_settings_page_id_fkey(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async getPage(userId: string) {
    return await supabase
      .from('link_bio_pages')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
  },

  async createPage(userId: string, username: string) {
    const { data: page, error } = await supabase
      .from('link_bio_pages')
      .insert({
        user_id: userId,
        username: username,
        // title: `@${username}`, // Removed because column missing
        is_active: true,
      })
      .select()
      .single();

    if (error) return { data: null, error };

    // Create default theme
    const defaultTheme = {
      page_id: page.id,
      background_type: 'solid',
      background_value: '#000000',
      button_style: 'rounded',
      button_color: '#ffffff',
      button_text_color: '#000000',
      font_family: 'inter',
    };

    const { error: themeError } = await supabase
      .from('link_bio_theme_settings')
      .insert(defaultTheme);

    if (themeError) console.error('Error creating default theme:', themeError);

    return { data: page, error: null };
  },

  async updatePage(pageId: string, updates: Partial<LinkBioPage> & { title?: string }) {
    // Filter out title if it's passed, as the column doesn't exist
    const { title, ...safeUpdates } = updates;
    return await supabase
      .from('link_bio_pages')
      .update({ ...safeUpdates })
      .eq('id', pageId)
      .select()
      .single();
  },

  async checkUsername(username: string) {
    const { data } = await supabase
      .from('link_bio_pages')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    return !!data;
  },

  async deletePage(pageId: string) {
    // Cascading delete should handle links and theme settings if configured in DB
    // Otherwise we delete manually
    await supabase.from('link_bio_links').delete().eq('page_id', pageId);
    await supabase.from('link_bio_theme_settings').delete().eq('page_id', pageId);
    return await supabase.from('link_bio_pages').delete().eq('id', pageId);
  },

  async setPageActive(pageId: string, userId: string) {
    // 1. Set all user pages to inactive
    await supabase
      .from('link_bio_pages')
      .update({ is_active: false })
      .eq('user_id', userId);

    // 2. Set specific page to active
    return await supabase
      .from('link_bio_pages')
      .update({ is_active: true })
      .eq('id', pageId)
      .select()
      .single();
  },

  async duplicatePage(pageId: string, userId: string) {
    // 1. Fetch original page
    const { data: originalPage } = await this.getPageById(pageId);
    if (!originalPage) throw new Error("Page not found");

    // 2. Create new page (generate unique username)
    const timestamp = Math.floor(Date.now() / 1000);
    const newUsername = `${originalPage.username}-${timestamp}`;
    
    const { data: newPage, error: pageError } = await supabase
      .from('link_bio_pages')
      .insert({
        user_id: userId,
        username: newUsername,
        bio: originalPage.bio,
        profile_image_url: originalPage.profile_image_url,
        is_active: false // Default to inactive on duplicate
      })
      .select()
      .single();

    if (pageError || !newPage) throw pageError;

    // 3. Duplicate Theme
    const { data: theme } = await this.getTheme(pageId);
    if (theme) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, page_id, ...themeData } = theme;
      await supabase.from('link_bio_theme_settings').insert({
        ...themeData,
        page_id: newPage.id
      });
    }

    // 4. Duplicate Links
    const { data: links } = await this.getLinks(pageId);
    if (links && links.length > 0) {
      const linksToInsert = links.map(link => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, page_id, ...linkData } = link;
        return {
          ...linkData,
          page_id: newPage.id
        };
      });
      await supabase.from('link_bio_links').insert(linksToInsert);
    }

    return { data: newPage, error: null };
  },

  async getPageById(pageId: string) {
    return await supabase
      .from('link_bio_pages')
      .select('*')
      .eq('id', pageId)
      .single();
  },

  // --- LINKS ---
  async getLinks(pageId: string) {
    return await supabase
      .from('link_bio_links')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index', { ascending: true });
  },

  async createLink(link: { page_id: string; title: string; url: string; is_active?: boolean; icon_key?: string; icon_url?: string }) {
    // Validate inputs
    if (!link.page_id) return { data: null, error: { message: 'Page ID is required', details: '', hint: '', code: '' } };
    if (!link.title) return { data: null, error: { message: 'Title is required', details: '', hint: '', code: '' } };
    if (!link.url) return { data: null, error: { message: 'URL is required', details: '', hint: '', code: '' } };

    // Get max position
    const { data: maxPos } = await supabase
      .from('link_bio_links')
      .select('order_index')
      .eq('page_id', link.page_id)
      .order('order_index', { ascending: false })
      .limit(1)
      .maybeSingle();

    const order_index = (maxPos?.order_index ?? -1) + 1;

    return await supabase
      .from('link_bio_links')
      .insert({
        page_id: link.page_id,
        title: link.title,
        url: link.url,
        order_index,
        is_active: link.is_active ?? true,
        icon_key: link.icon_key,
        icon_url: link.icon_url
      })
      .select()
      .single();
  },

  async uploadPageAvatar(userId: string, pageId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `avatars/${userId}/${pageId}/${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('link_bio_avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('link_bio_avatars')
      .getPublicUrl(filePath);

    return { 
      data: { 
        path: filePath, 
        publicUrl 
      }, 
      error: null 
    };
  },

  async uploadLinkAsset(userId: string, pageId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const randomId = Math.random().toString(36).substring(2, 15);
    // Path: <user_id>/<page_id>/<random>.png
    const filePath = `${userId}/${pageId}/${randomId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('link_bio_assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('link_bio_assets')
      .getPublicUrl(filePath);

    return { 
      data: { 
        path: filePath, 
        publicUrl 
      }, 
      error: null 
    };
  },

  async deleteLinkImage(path: string) {
    return await supabase.storage
      .from('link_bio_assets')
      .remove([path]);
  },

  async updateLink(linkId: string, updates: Partial<LinkBioLink>) {
    return await supabase
      .from('link_bio_links')
      .update({ ...updates })
      .eq('id', linkId)
      .select()
      .single();
  },

  async deleteLink(linkId: string) {
    return await supabase
      .from('link_bio_links')
      .delete()
      .eq('id', linkId);
  },

  async reorderLinks(linkIds: string[]) {
    // Naive reorder
    const updates = linkIds.map((id, idx) => 
      supabase
        .from('link_bio_links')
        .update({ order_index: idx })
        .eq('id', id)
    );
    await Promise.all(updates);
  },

  // --- THEME ---
  async getTheme(pageId: string) {
    return await supabase
      .from('link_bio_theme_settings')
      .select('*')
      .eq('page_id', pageId)
      .maybeSingle();
  },

  async updateTheme(pageId: string, theme: Partial<LinkBioTheme>) {
    // Check if exists
    const { data: existing } = await supabase
      .from('link_bio_theme_settings')
      .select('id')
      .eq('page_id', pageId)
      .maybeSingle();

    if (existing) {
      return await supabase
        .from('link_bio_theme_settings')
        .update({ ...theme, updated_at: new Date().toISOString() })
        .eq('page_id', pageId)
        .select()
        .single();
    } else {
      return await supabase
        .from('link_bio_theme_settings')
        .insert({ ...theme, page_id: pageId })
        .select()
        .single();
    }
  },
  
  // --- ANALYTICS ---
  async trackClick(slug: string, linkId: string) {
    try {
      await supabase.from('link_analytics').insert({
        link_id: linkId,
        slug: slug, // Added slug as requested
        clicked_at: new Date().toISOString(),
        referrer: document.referrer,
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent,
        country: 'unknown',
        os: 'unknown'
      });
    } catch (e) {
      console.error("Tracking failed", e);
    }
  },

  // --- PUBLIC PAGE (CLIENT SIDE FETCH) ---
  
  getEdgeFunctionUrl(functionName: string) {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_FUNCTIONS_URL) {
      // @ts-ignore
      return `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/${functionName}`;
    }
    if (projectId) {
      return `https://${projectId}.supabase.co/functions/v1/${functionName}`;
    }
    return '';
  },

  getLinkBioPublicUrl(username: string) {
    // Return internal route for SPA navigation when possible, or full URL
    return `${window.location.origin}/u/${username}`;
  },

  async getPublicPage(username: string) {
    // Fetch directly from DB as requested (not Edge Function)
    try {
      const { data: page } = await supabase
        .from('link_bio_pages')
        .select('*')
        .eq('username', username)
        .maybeSingle();
        
      if (!page) return { data: null, error: 'Page not found' };
      
      const { data: links } = await supabase
        .from('link_bio_links')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_active', true) // Only active links
        .order('order_index', { ascending: true });
        
      const { data: theme } = await supabase
        .from('link_bio_theme_settings')
        .select('*')
        .eq('page_id', page.id)
        .maybeSingle();
        
      return { data: { page, links: links || [], theme }, error: null };
    } catch (e) {
      console.error('Error fetching public page:', e);
      return { data: null, error: e };
    }
  }
};
