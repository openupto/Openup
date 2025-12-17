import { supabase } from './client';

// ============================================
// TYPES
// ============================================

export interface TimeseriesData {
  day: string;
  clicks: number;
}

export interface HeatmapData {
  dow: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  clicks: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
}

export interface CountryData {
  country: string;
  clicks: number;
}

export interface TopLinkData {
  link_id: string;
  slug: string;
  clicks: number;
}

export interface ReferrerData {
  referer: string;
  clicks: number;
}

// ============================================
// ANALYTICS QUERIES
// ============================================

export const analyticsQueries = {
  /**
   * Get timeseries clicks grouped by day
   */
  async timeseriesClicks(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: TimeseriesData[] | null; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('clicked_at, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by day on client side
      const grouped = new Map<string, number>();
      
      data?.forEach((row: any) => {
        const date = new Date(row.clicked_at);
        const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
        grouped.set(day, (grouped.get(day) || 0) + 1);
      });

      const result: TimeseriesData[] = Array.from(grouped.entries())
        .map(([day, clicks]) => ({ day, clicks }))
        .sort((a, b) => a.day.localeCompare(b.day));

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching timeseries clicks:', error);
      return { data: null, error };
    }
  },

  /**
   * Get hourly heatmap (day of week × hour)
   */
  async hourlyHeatmap(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: HeatmapData[] | null; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('clicked_at, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by dow and hour
      const grouped = new Map<string, number>();
      
      data?.forEach((row: any) => {
        const date = new Date(row.clicked_at);
        const dow = date.getDay(); // 0-6
        const hour = date.getHours(); // 0-23
        const key = `${dow}-${hour}`;
        grouped.set(key, (grouped.get(key) || 0) + 1);
      });

      const result: HeatmapData[] = Array.from(grouped.entries()).map(([key, clicks]) => {
        const [dow, hour] = key.split('-').map(Number);
        return { dow, hour, clicks };
      });

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching hourly heatmap:', error);
      return { data: null, error };
    }
  },

  /**
   * Get clicks by device type
   */
  async byDevice(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: DeviceData[] | null; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('device_type, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by device
      const grouped = new Map<string, number>();
      
      data?.forEach((row: any) => {
        const device = row.device_type || 'other';
        grouped.set(device, (grouped.get(device) || 0) + 1);
      });

      const result: DeviceData[] = Array.from(grouped.entries()).map(([device, clicks]) => ({
        device,
        clicks,
      }));

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching device data:', error);
      return { data: null, error };
    }
  },

  /**
   * Get clicks by country (top 15)
   */
  async byCountry(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: CountryData[] | null; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('country, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by country
      const grouped = new Map<string, number>();
      
      data?.forEach((row: any) => {
        const country = row.country || 'Unknown';
        grouped.set(country, (grouped.get(country) || 0) + 1);
      });

      const result: CountryData[] = Array.from(grouped.entries())
        .map(([country, clicks]) => ({ country, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 15);

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching country data:', error);
      return { data: null, error };
    }
  },

  /**
   * Get top links by clicks
   */
  async topLinks(
    userId: string,
    from: Date,
    to: Date,
    limit: number = 10
  ): Promise<{ data: TopLinkData[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('link_analytics')
        .select('link_id, clicked_at, links!inner(user_id, slug)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (error) throw error;

      // Group by link_id
      const grouped = new Map<string, { slug: string; clicks: number }>();
      
      data?.forEach((row: any) => {
        const linkId = row.link_id;
        const slug = row.links?.slug || 'unknown';
        const existing = grouped.get(linkId);
        
        if (existing) {
          existing.clicks += 1;
        } else {
          grouped.set(linkId, { slug, clicks: 1 });
        }
      });

      const result: TopLinkData[] = Array.from(grouped.entries())
        .map(([link_id, { slug, clicks }]) => ({ link_id, slug, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, limit);

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching top links:', error);
      return { data: null, error };
    }
  },

  /**
   * Get clicks by referrer (top 15)
   */
  async byReferrer(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: ReferrerData[] | null; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('referrer, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by referrer
      const grouped = new Map<string, number>();
      
      data?.forEach((row: any) => {
        const referer = row.referrer || 'Direct';
        grouped.set(referer, (grouped.get(referer) || 0) + 1);
      });

      const result: ReferrerData[] = Array.from(grouped.entries())
        .map(([referer, clicks]) => ({ referer, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 15);

      return { data: result, error: null };
    } catch (error: any) {
      console.error('Error fetching referrer data:', error);
      return { data: null, error };
    }
  },

  /**
   * Get total clicks count
   */
  async totalClicks(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: number; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('id, link_id, links!inner(user_id)', { count: 'exact', head: true })
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { count, error } = await query;

      if (error) throw error;

      return { data: count || 0, error: null };
    } catch (error: any) {
      console.error('Error fetching total clicks:', error);
      return { data: 0, error };
    }
  },

  /**
   * Get distinct countries count
   */
  async distinctCountries(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: number; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('country, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueCountries = new Set(data?.map((row: any) => row.country).filter(Boolean));

      return { data: uniqueCountries.size, error: null };
    } catch (error: any) {
      console.error('Error fetching distinct countries:', error);
      return { data: 0, error };
    }
  },

  /**
   * Get distinct devices count
   */
  async distinctDevices(
    userId: string,
    from: Date,
    to: Date,
    linkId?: string | null
  ): Promise<{ data: number; error: any }> {
    try {
      let query = supabase
        .from('link_analytics')
        .select('device_type, link_id, links!inner(user_id)')
        .gte('clicked_at', from.toISOString())
        .lte('clicked_at', to.toISOString())
        .eq('links.user_id', userId);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueDevices = new Set(data?.map((row: any) => row.device_type).filter(Boolean));

      return { data: uniqueDevices.size, error: null };
    } catch (error: any) {
      console.error('Error fetching distinct devices:', error);
      return { data: 0, error };
    }
  },
};

// ============================================
// EXPORT CSV UTILITIES
// ============================================

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
