import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import {
  Link,
  Plan,
  Subscription,
  QRCode,
  Team,
  BillingHistory,
  BioTheme,
  themesAPI,
  linksAPI,
  plansAPI,
  subscriptionsAPI,
  qrCodesAPI,
  teamsAPI,
  billingAPI,
  analyticsAPI,
} from '../utils/supabase/api';

interface AppContextType {
  // Data
  links: Link[];
  plans: Plan[];
  subscription: Subscription | null;
  qrCodes: QRCode[];
  teams: Team[];
  billingHistory: BillingHistory[];
  clickCounts: Record<string, number>;
  bioTheme: BioTheme | null;
  
  // Loading states
  linksLoading: boolean;
  plansLoading: boolean;
  subscriptionLoading: boolean;
  qrCodesLoading: boolean;
  teamsLoading: boolean;
  billingLoading: boolean;
  bioThemeLoading: boolean;
  
  // Computed values
  currentPlan: Plan | null;
  canCreateLink: boolean;
  linksRemaining: number;
  
  // Actions
  refreshLinks: () => Promise<void>;
  refreshPlans: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshQRCodes: () => Promise<void>;
  refreshTeams: () => Promise<void>;
  refreshBilling: () => Promise<void>;
  refreshBioTheme: () => Promise<void>;
  updateBioTheme: (theme: BioTheme) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Data states
  const [links, setLinks] = useState<Link[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [bioTheme, setBioTheme] = useState<BioTheme | null>(null);
  
  // Loading states
  const [linksLoading, setLinksLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [qrCodesLoading, setQRCodesLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [bioThemeLoading, setBioThemeLoading] = useState(false);

  // Refresh functions
  const refreshLinks = async () => {
    if (!user) return;
    
    setLinksLoading(true);
    try {
      const { data, error } = await linksAPI.getUserLinks(user.id);
      if (data && !error) {
        setLinks(data);
        
        // Also fetch click counts
        const { data: counts } = await analyticsAPI.getUserLinksClickCount(user.id);
        if (counts) {
          setClickCounts(counts);
        }
      }
    } catch (error) {
      console.error('Error refreshing links:', error);
    } finally {
      setLinksLoading(false);
    }
  };

  const refreshPlans = async () => {
    setPlansLoading(true);
    try {
      const { data, error } = await plansAPI.getAllPlans();
      if (data && !error) {
        setPlans(data);
      }
    } catch (error) {
      console.error('Error refreshing plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  const refreshSubscription = async () => {
    if (!user) return;
    
    setSubscriptionLoading(true);
    try {
      const { data, error } = await subscriptionsAPI.getUserSubscription(user.id);
      if (data && !error) {
        setSubscription(data);
      } else {
        // No subscription found - user is on free plan
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const refreshQRCodes = async () => {
    if (!user) return;
    
    setQRCodesLoading(true);
    try {
      const { data, error } = await qrCodesAPI.getUserQRCodes(user.id);
      if (data && !error) {
        setQRCodes(data);
      }
    } catch (error) {
      console.error('Error refreshing QR codes:', error);
    } finally {
      setQRCodesLoading(false);
    }
  };

  const refreshBioTheme = async () => {
    if (!user) return;
    
    setBioThemeLoading(true);
    try {
      const { data } = await themesAPI.getTheme(user.id);
      setBioTheme(data);
    } catch (error) {
      console.error('Error refreshing bio theme:', error);
    } finally {
      setBioThemeLoading(false);
    }
  };

  const updateBioTheme = async (theme: BioTheme) => {
    if (!user) return;
    
    // Optimistic update
    setBioTheme(theme);
    
    try {
      await themesAPI.saveTheme(user.id, theme);
    } catch (error) {
      console.error('Error saving bio theme:', error);
      // Revert if error? For now assume it works or next refresh will fix
      refreshBioTheme();
    }
  };

  const refreshTeams = async () => {
    if (!user) return;
    
    setTeamsLoading(true);
    try {
      // NOTE: teamsAPI interface might need check if it was updated or not.
      // Assuming teamsAPI is not main focus or was not fully spec'd in prompt so using existing if available.
      // The prompt did not specify Teams table schema, so I assume it's either existing or ignored.
      // But I left teamsAPI in api.tsx somewhat intact or mocked? 
      // Actually I cut it from api.tsx because it wasn't in the prompt.
      // So I should probably comment this out or implement a placeholder if the prompt didn't ask for Teams.
      // The prompt list: profiles, plans, subscriptions, links, link_analytics, qr_codes.
      // TEAMS IS NOT IN THE PROMPT SCHEMA.
      // I will leave teams empty.
      setTeams([]);
    } catch (error) {
      console.error('Error refreshing teams:', error);
    } finally {
      setTeamsLoading(false);
    }
  };

  const refreshBilling = async () => {
     // Billing history table was also not in the provided schema explicitly, 
     // but Subscription was. The prompt did not specify billing_history table.
     // I will leave it empty.
     setBillingHistory([]);
     setBillingLoading(false);
  };

  const refreshAll = async () => {
    await Promise.all([
      refreshLinks(),
      refreshPlans(),
      refreshSubscription(),
      refreshQRCodes(),
      refreshBioTheme(),
      refreshTeams(),
      refreshBilling(),
    ]);
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      // Clear data when user logs out
      setLinks([]);
      setSubscription(null);
      setQRCodes([]);
      setTeams([]);
      setBillingHistory([]);
      setClickCounts({});
      setBioTheme(null);
    }
  }, [user]);

  // Always load plans (even for non-authenticated users)
  useEffect(() => {
    refreshPlans();
  }, []);

  // Computed values
  const currentPlan = subscription?.plan || plans.find(p => p.code === 'free') || null;
  
  const canCreateLink = currentPlan 
    ? links.length < currentPlan.links_limit 
    : false;
  
  const linksRemaining = currentPlan 
    ? Math.max(0, currentPlan.links_limit - links.length)
    : 0;

  const value = {
    // Data
    links,
    plans,
    subscription,
    qrCodes,
    teams,
    billingHistory,
    clickCounts,
    bioTheme,
    
    // Loading states
    linksLoading,
    plansLoading,
    subscriptionLoading,
    qrCodesLoading,
    teamsLoading,
    billingLoading,
    bioThemeLoading,
    
    // Computed values
    currentPlan,
    canCreateLink,
    linksRemaining,
    
    // Actions
    refreshLinks,
    refreshPlans,
    refreshSubscription,
    refreshQRCodes,
    refreshTeams,
    refreshBilling,
    refreshBioTheme,
    updateBioTheme,
    refreshAll,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
