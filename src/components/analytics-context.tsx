import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AnalyticsFilters {
  from: Date;
  to: Date;
  currentLinkId: string | null;
  compareEnabled: boolean;
}

interface AnalyticsContextType {
  // Filters
  filters: AnalyticsFilters;
  setDateRange: (from: Date, to: Date) => void;
  setCurrentLinkId: (linkId: string | null) => void;
  setCompareEnabled: (enabled: boolean) => void;
  
  // States
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Computed
  previousPeriodRange: { from: Date; to: Date } | null;
  
  // Actions
  resetFilters: () => void;
  applyPreset: (preset: '24h' | '7d' | '30d' | '90d' | 'all') => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const STORAGE_KEY = 'openup_analytics_filters';

// Default: Last 7 days
const getDefaultFilters = (): AnalyticsFilters => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  
  return {
    from,
    to,
    currentLinkId: null,
    compareEnabled: false,
  };
};

// Load filters from localStorage
const loadFilters = (): AnalyticsFilters => {
  if (typeof window === 'undefined') {
    return getDefaultFilters();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        from: new Date(parsed.from),
        to: new Date(parsed.to),
      };
    }
  } catch (error) {
    console.error('Error loading analytics filters:', error);
  }
  return getDefaultFilters();
};

// Save filters to localStorage
const saveFilters = (filters: AnalyticsFilters) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...filters,
      from: filters.from.toISOString(),
      to: filters.to.toISOString(),
    }));
  } catch (error) {
    console.error('Error saving analytics filters:', error);
  }
};

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AnalyticsFilters>(loadFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  // Calculate previous period range
  const previousPeriodRange = (() => {
    if (!filters.compareEnabled) return null;
    
    const periodLength = filters.to.getTime() - filters.from.getTime();
    const previousTo = new Date(filters.from.getTime() - 1); // 1ms before current from
    const previousFrom = new Date(previousTo.getTime() - periodLength);
    
    return { from: previousFrom, to: previousTo };
  })();

  const setDateRange = (from: Date, to: Date) => {
    setFilters(prev => ({ ...prev, from, to }));
  };

  const setCurrentLinkId = (linkId: string | null) => {
    setFilters(prev => ({ ...prev, currentLinkId: linkId }));
  };

  const setCompareEnabled = (enabled: boolean) => {
    setFilters(prev => ({ ...prev, compareEnabled: enabled }));
  };

  const resetFilters = () => {
    setFilters(getDefaultFilters());
  };

  const applyPreset = (preset: '24h' | '7d' | '30d' | '90d' | 'all') => {
    const to = new Date();
    const from = new Date();
    
    switch (preset) {
      case '24h':
        from.setHours(from.getHours() - 24);
        break;
      case '7d':
        from.setDate(from.getDate() - 7);
        break;
      case '30d':
        from.setDate(from.getDate() - 30);
        break;
      case '90d':
        from.setDate(from.getDate() - 90);
        break;
      case 'all':
        // Set to account creation date or 1 year ago
        from.setFullYear(from.getFullYear() - 1);
        break;
    }
    
    setDateRange(from, to);
  };

  const value = {
    filters,
    setDateRange,
    setCurrentLinkId,
    setCompareEnabled,
    loading,
    setLoading,
    error,
    setError,
    previousPeriodRange,
    resetFilters,
    applyPreset,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
