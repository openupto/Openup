import { useState, useEffect } from 'react';
import { AppLayout } from './layout/app-layout';
import { DashboardView } from './views/dashboard-view';
import { LinksView } from './views/links-view';
import { AnalyticsView } from './views/analytics-view';
import { SettingsView } from './views/settings-view';
import { LinkInBioView } from './views/link-in-bio-view';
import { TeamView } from './views/team-view';
import { CreateMenu } from './create-menu';
import { CreateLinkWizard } from './create-link-wizard';
import { CreateQRWizard } from './create-qr-wizard';
import { CreateBioWizard } from './create-bio-wizard';
import { BioEditor } from './bio-editor';
import { ProfilePage } from './settings/profile-page';
import { SubscriptionPage } from './settings/subscription-page';
import { BillingPage } from './settings/billing-page';
import { ParametersPage } from './settings/parameters-page';
import { CustomDomainPage } from './settings/custom-domain-page';
import { IntegrationsPage } from './settings/integrations-page';
import { HelpPage } from './settings/help-page';
import { FaqPage } from './settings/faq-page';
import { useAuth } from './auth-context';
import { useApp } from './app-context';

export function MainDashboard() {
  const { user, profile, signOut } = useAuth();
  const { subscription, links } = useApp();
  const [activeView, setActiveView] = useState('links');
  const [settingsSubpage, setSettingsSubpage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showLinkWizard, setShowLinkWizard] = useState(false);
  const [showQRWizard, setShowQRWizard] = useState(false);
  const [showBioWizard, setShowBioWizard] = useState(false);
  const [bioToEdit, setBioToEdit] = useState<any>(null);
  const [showBioEditor, setShowBioEditor] = useState(false);
  const [bioRefreshTrigger, setBioRefreshTrigger] = useState(0);

  // Mapper les IDs du FuturisticSidebar vers nos vues
  const mapViewId = (id: string): string => {
    const mapping: Record<string, string> = {
      'design': 'links',
      'links': 'links',
      'analytics': 'analytics',
      'link-in-bio': 'link-in-bio',
      'team': 'team',
      'settings': 'settings',
    };
    return mapping[id] || id;
  };

  const reverseMapViewId = (id: string): string => {
    const reverseMapping: Record<string, string> = {
      'links': 'design',
      'analytics': 'analytics',
      'link-in-bio': 'link-in-bio',
      'team': 'team',
      'settings': 'settings',
    };
    return reverseMapping[id] || id;
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const userData = {
    id: user?.id || '1',
    email: user?.email || profile?.email || 'demo@openup.com',
    name: profile?.full_name || user?.user_metadata?.full_name || 'User',
    avatar_url: profile?.avatar_url,
    subscription_tier: subscription?.plan?.code || 'free',
    links_count: links.length,
    created_at: profile?.created_at || user?.created_at || new Date().toISOString()
  };

  const handleCreateLink = () => {
    setShowCreateMenu(false);
    setShowLinkWizard(true);
  };

  const handleCreateQRCode = () => {
    setShowCreateMenu(false);
    setShowQRWizard(true);
  };

  const handleCreateBio = () => {
    setShowCreateMenu(false);
    setBioToEdit(null);
    setShowBioWizard(true);
  };

  const handleEditBio = (bio: any) => {
    setBioToEdit(bio);
    setShowBioEditor(true);
  };

  const handleBackFromEditor = () => {
    setShowBioEditor(false);
    setBioToEdit(null);
  };

  const handleOpenCreateMenu = () => {
    setShowCreateMenu(true);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const handleUpgrade = () => {
    setActiveView('settings');
    setSettingsSubpage('subscription');
  };

  const handleUpgradeClick = () => {
    setActiveView('settings');
    setSettingsSubpage('subscription');
  };

  const renderView = () => {
    switch (activeView) {
      case 'links':
        return (
          <LinksView 
            onCreateLink={handleCreateLink}
            onCreateQRCode={handleCreateQRCode}
            isMobile={isMobile}
          />
        );
      case 'analytics':
        return <AnalyticsView isMobile={isMobile} />;
      case 'team':
        return <TeamView isMobile={isMobile} />;
      case 'link-in-bio':
        if (showBioEditor && bioToEdit) {
          return (
            <BioEditor
              bio={bioToEdit}
              onBack={handleBackFromEditor}
              onSave={(data) => {
                console.log('Bio saved:', data);
                handleBackFromEditor();
              }}
              isMobile={isMobile}
            />
          );
        }
        return (
          <LinkInBioView 
            onCreateBio={handleCreateBio}
            onEditBio={handleEditBio}
            isMobile={isMobile}
            refreshTrigger={bioRefreshTrigger}
          />
        );
      case 'settings':
        // Sous-pages de paramètres
        if (settingsSubpage === 'profile') {
          return (
            <ProfilePage
              onBack={() => setSettingsSubpage(null)}
              userData={userData}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'subscription') {
          return (
            <SubscriptionPage
              onBack={() => setSettingsSubpage(null)}
              currentTier={userData.subscription_tier}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'billing') {
          return (
            <BillingPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'parameters') {
          return (
            <ParametersPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'custom-domain') {
          return (
            <CustomDomainPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'integrations') {
          return (
            <IntegrationsPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'help') {
          return (
            <HelpPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        if (settingsSubpage === 'faq') {
          return (
            <FaqPage
              onBack={() => setSettingsSubpage(null)}
              isMobile={isMobile}
            />
          );
        }
        
        // Page principale des paramètres
        return (
          <SettingsView 
            userData={userData}
            isMobile={isMobile}
            onNavigateToSubpage={setSettingsSubpage}
            onSignOut={handleSignOut}
          />
        );
      default:
        return (
          <DashboardView 
            onCreateLink={handleCreateLink}
            onNavigate={setActiveView}
            isMobile={isMobile}
          />
        );
    }
  };

  return (
    <>
      <AppLayout
        activeView={reverseMapViewId(activeView)}
        onViewChange={(viewId) => setActiveView(mapViewId(viewId))}
        onCreateClick={handleOpenCreateMenu}
        onSignOut={handleSignOut}
        subscriptionTier={userData.subscription_tier}
        isMobile={isMobile}
        userData={userData}
        onUpgradeClick={handleUpgrade}
      >
        {renderView()}
      </AppLayout>

      <CreateMenu
        isOpen={showCreateMenu}
        onClose={() => setShowCreateMenu(false)}
        onCreateLink={handleCreateLink}
        onCreateQRCode={handleCreateQRCode}
        onCreateBio={handleCreateBio}
        isMobile={isMobile}
      />

      <CreateLinkWizard
        isOpen={showLinkWizard}
        onClose={() => setShowLinkWizard(false)}
        subscriptionTier={userData.subscription_tier}
        isMobile={isMobile}
      />

      <CreateQRWizard
        isOpen={showQRWizard}
        onClose={() => setShowQRWizard(false)}
        subscriptionTier={userData.subscription_tier}
        isMobile={isMobile}
      />

      <CreateBioWizard
        isOpen={showBioWizard}
        onClose={() => {
          setShowBioWizard(false);
          setBioToEdit(null);
        }}
        onSuccess={() => setBioRefreshTrigger(prev => prev + 1)}
        bioToEdit={bioToEdit}
        subscriptionTier={userData.subscription_tier}
        isMobile={isMobile}
      />
    </>
  );
}
