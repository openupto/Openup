import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from './auth-context';
import { AuthModal } from './auth-modal';
import { LinksManagement } from './links-management';
import { Analytics } from './analytics';
import { Settings } from './settings';
import { CreateLinkModal } from './create-link-modal';
import { ModernCreateLinkModal } from './modern-create-link-modal';
import { PageDesigner } from './page-designer';
import { ModernLinkInBio } from './modern-link-in-bio';
import { FuturisticSidebar } from './futuristic-sidebar';
import { WalletCard } from './wallet-card';
import { AIStudio } from './ai-studio';
import { TeamWorkspace } from './team-workspace';
import { QRCodesPage } from './qr-codes-page';
import { MobileHeader } from './mobile-header';
import { LinkTabNavigation } from './link-tab-navigation';
import { SimpleMobileInterface } from './simple-mobile-interface';
import { MobileLayout } from './mobile-layout';
import { MobileAnalyticsView } from './mobile-analytics-view';
import { MobileSettingsView } from './mobile-settings-view';
import { MobileProfileView } from './mobile-profile-view';
import { MobileLinkInBioView } from './mobile-link-in-bio-view';
import { MobileCreateMenu } from './mobile-create-menu';
import { MobileLinkWizard } from './mobile-link-wizard';
import { MobileLinkInBioList } from './mobile-link-in-bio-list';
import { DashboardWelcome } from './dashboard-welcome';
import { useTheme } from './theme-context';
import logoOpenUp from 'figma:asset/10fb543094c34b061a3706fe85bbb343a6812697.png';
import { 
  Link2, 
  Plus, 
  BarChart3, 
  Settings as SettingsIcon,
  User,
  LogOut,
  Crown,
  ExternalLink,
  Palette,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserData {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  links_count: number;
  created_at: string;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [showMobileCreateMenu, setShowMobileCreateMenu] = useState(false);
  const [showMobileLinkWizard, setShowMobileLinkWizard] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<'links' | 'qr-codes'>('links');
  const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      // Use fake data instead of API call
      setUserData({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'Demo User',
        subscription_tier: 'pro',
        links_count: 5,
        created_at: '2024-01-01T00:00:00.000Z'
      });
      setLoading(false);
    } else {
      setLoading(false);
      setShowAuthModal(true);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const fetchUserData = () => {
    // Placeholder for data fetching
    console.log('Fetching user data...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3399ff]"></div>
      </div>
    );
  }

  // Show auth interface if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3399ff] to-blue-600 rounded-2xl flex items-center justify-center p-3">
                <img 
                  src={logoOpenUp} 
                  alt="OpenUp Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#3399ff] to-blue-600 bg-clip-text text-transparent">
              Bienvenue sur OpenUp
            </h1>
            <p className="text-slate-600 dark:text-gray-400">Créez votre page de liens personnalisée en quelques secondes</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-[#3399ff] to-blue-600 hover:from-blue-600 hover:to-[#3399ff]"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
            >
              Créer ma page
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
            >
              J'ai déjà un compte
            </Button>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    );
  }

  const renderActiveContent = () => {
    // Sur mobile, wrapper tout le contenu dans MobileLayout
    if (isMobile) {
      // Pour 'design' et 'dashboard', afficher SimpleMobileInterface sans les wrappers
      if (activeTab === 'design' || activeTab === 'dashboard') {
        return (
          <SimpleMobileInterface
            userData={userData}
            onMenuOpen={() => setIsMobileMenuOpen(true)}
            onCreateLink={() => setShowMobileCreateMenu(true)}
            activeBottomTab={activeTab}
            onBottomTabChange={setActiveTab}
          />
        );
      }

      // Pour 'link-in-bio', utiliser le composant modern adapté
      if (activeTab === 'link-in-bio') {
        return (
          <MobileLayout
            subscriptionTier={userData?.subscription_tier || 'starter'}
            onMenuOpen={() => setIsMobileMenuOpen(true)}
            onCreateLink={() => setShowMobileCreateMenu(true)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hideUpgradeButton={false}
          >
            <ModernLinkInBio userData={userData} />
          </MobileLayout>
        );
      }
      
      // Pages analytics et settings ont déjà leur propre header
      if (activeTab === 'analytics') {
        return <MobileAnalyticsView onMenuOpen={() => setIsMobileMenuOpen(true)} />;
      }
      
      if (activeTab === 'settings') {
        return <MobileSettingsView userData={userData} onMenuOpen={() => setIsMobileMenuOpen(true)} />;
      }
      
      // Pour les autres tabs, wrapper dans MobileLayout
      let content;
      switch (activeTab) {
        case 'wallet-card':
          content = <WalletCard userData={userData} />;
          break;
        case 'ai-studio':
          content = <AIStudio userData={userData} />;
          break;
        case 'team-mode':
          content = <TeamWorkspace userData={userData} />;
          break;
        default:
          content = <DashboardWelcome userData={userData} />;
      }
      
      return (
        <MobileLayout
          subscriptionTier={userData?.subscription_tier || 'starter'}
          onMenuOpen={() => setIsMobileMenuOpen(true)}
          onCreateLink={() => setShowMobileCreateMenu(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hideUpgradeButton={false}
        >
          {content}
        </MobileLayout>
      );
    }
    
    // Desktop rendering
    switch (activeTab) {
      case 'design':
        // Sur desktop, contenu pour l'onglet Link avec navigation entre links et qr-codes
        return (
          <div className="space-y-6">
            {/* Contenu basé sur le sous-onglet actif */}
            {activeSubTab === 'links' ? (
              <LinksManagement 
                userData={userData} 
                onUpdateUserData={setUserData}
                onViewAnalytics={(linkId) => {
                  setSelectedLinkForAnalytics(linkId);
                  setActiveTab('analytics');
                }}
              />
            ) : (
              <QRCodesPage userData={userData} />
            )}
          </div>
        );
      case 'links':
        return (
          <LinksManagement 
            userData={userData} 
            onUpdateUserData={setUserData}
            onViewAnalytics={(linkId) => {
              setSelectedLinkForAnalytics(linkId);
              setActiveTab('analytics');
            }}
          />
        );
      case 'qr-codes':
        return <QRCodesPage userData={userData} />;
      case 'link-in-bio':
        return <ModernLinkInBio userData={userData} />;
      case 'analytics':
        return <Analytics initialLinkId={selectedLinkForAnalytics} />;
      case 'wallet-card':
        return <WalletCard userData={userData} />;
      case 'ai-studio':
        return <AIStudio userData={userData} />;
      case 'team-mode':
        return <TeamWorkspace userData={userData} />;

      case 'automations':
        return (
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Automations</h2>
            <Card>
              <CardContent className="p-6 md:p-8 text-center">
                <div className="text-sm md:text-base text-slate-500">Automation features coming soon...</div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return <Settings userData={userData} onUpdateUserData={setUserData} />;
      case 'dashboard':
        return <DashboardWelcome userData={userData} />;
      default:
        return <DashboardWelcome userData={userData} />;
    }
  };

  return (
    <div className={`min-h-screen ${
      activeTab === 'link-in-bio' || (isMobile && activeTab === 'design') 
        ? 'bg-gray-50' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800'
    }`}>
      {/* Mobile Header - Hide for design tab and dashboard (ils ont leur propre header) */}
      {isMobile && activeTab !== 'design' && activeTab !== 'dashboard' && (
        <MobileHeader
          userData={userData}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onCreateLink={() => setShowCreateLink(true)}
        />
      )}

      {/* Futuristic Sidebar - Hidden on mobile */}
      {!isMobile && (
        <FuturisticSidebar 
          userData={userData}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          onSignOut={handleSignOut}
          onCreateLink={() => setShowCreateLink(true)}
          isMobileOpen={false}
          onMobileToggle={() => {}}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 overscroll-contain">
            <FuturisticSidebar 
              userData={userData}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              onSignOut={handleSignOut}
              onCreateLink={() => {
                setShowCreateLink(true);
                setIsMobileMenuOpen(false);
              }}
              isMobileOpen={true}
              onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              collapsed={false}
              onCollapsedChange={() => {}}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 content-with-sidebar ${
        isMobile 
          ? 'content-mobile' 
          : sidebarCollapsed 
            ? 'content-sidebar-collapsed' 
            : 'content-sidebar-expanded'
      }`}>
        <div className={`${
          isMobile 
            ? activeTab === 'design' 
              ? 'min-h-screen' 
              : 'pt-20 px-4 sm:px-6 pb-32 min-h-screen'
            : 'p-4 sm:p-6 md:p-8 lg:p-10'
        }`}>
          {/* Quick Stats - Only show on main tabs */}
          {['design', 'links', 'analytics'].includes(activeTab) && (
            <>
              {/* Welcome Section - Hidden on mobile for certain tabs */}
              <div className={`mb-6 md:mb-8 lg:mb-10 ${isMobile && !['design'].includes(activeTab) ? 'hidden' : ''}`}>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-slate-800 dark:text-white">Welcome back, {userData?.name}!</h1>
                <p className="text-slate-600 dark:text-gray-400 text-base md:text-lg">Manage your link page and track your audience engagement.</p>
              </div>

              {/* Quick Stats - Condensed on mobile */}
              <div className={`grid gap-4 mb-6 md:mb-8 lg:mb-10 ${
                isMobile 
                  ? 'grid-cols-3 gap-2' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8'
              }`}>
                <Card className="hover-lift">
                  <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-3' : 'pb-2'}`}>
                    <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                      {isMobile ? 'Links' : 'Links on Page'}
                    </CardTitle>
                    <Link2 className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                  </CardHeader>
                  <CardContent className={isMobile ? 'pb-2 px-3' : 'pb-3'}>
                    <div className={`font-bold text-[#3399ff] ${isMobile ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
                      {userData?.links_count || 0}
                    </div>
                    {!isMobile && (
                      <p className="text-xs text-muted-foreground">
                        {userData?.subscription_tier === 'free' ? '5 links max' : 
                         userData?.subscription_tier === 'starter' ? 'Unlimited links' :
                         userData?.subscription_tier === 'pro' ? 'Unlimited links' : 'Unlimited links'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-3' : 'pb-2'}`}>
                    <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                      {isMobile ? 'Vues' : 'Page Views'}
                    </CardTitle>
                    <BarChart3 className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                  </CardHeader>
                  <CardContent className={isMobile ? 'pb-2 px-3' : 'pb-3'}>
                    <div className={`font-bold text-[#3399ff] ${isMobile ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>1,247</div>
                    {!isMobile && <p className="text-xs text-muted-foreground">All time</p>}
                  </CardContent>
                </Card>

                <Card className="hover-lift">
                  <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-3' : 'pb-2'}`}>
                    <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                      {isMobile ? 'Clics' : 'Link Clicks'}
                    </CardTitle>
                    <BarChart3 className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                  </CardHeader>
                  <CardContent className={isMobile ? 'pb-2 px-3' : 'pb-3'}>
                    <div className={`font-bold text-[#3399ff] ${isMobile ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>892</div>
                    {!isMobile && <p className="text-xs text-muted-foreground">total link clicks</p>}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Active Content */}
          <div className="animate-slide-in-top">
            {renderActiveContent()}
          </div>
        </div>
      </div>

      <ModernCreateLinkModal 
        isOpen={showCreateLink} 
        onClose={() => setShowCreateLink(false)}
        onLinkCreated={() => {
          setShowCreateLink(false);
          fetchUserData();
        }}
        userTier={userData?.subscription_tier || 'free'}
      />

      <MobileCreateMenu
        isOpen={showMobileCreateMenu}
        onClose={() => setShowMobileCreateMenu(false)}
        onCreateLink={() => {
          setShowMobileCreateMenu(false);
          // Sur mobile, ouvrir le wizard au lieu du modal desktop
          if (isMobile) {
            setShowMobileLinkWizard(true);
          } else {
            setShowCreateLink(true);
          }
        }}
        onCreateQRCode={() => {
          setShowMobileCreateMenu(false);
          setActiveTab('dashboard');
          setActiveSubTab('qr-codes');
          // Ouvrir le modal QR code après un petit délai
          setTimeout(() => setShowCreateLink(true), 300);
        }}
        onCreateLinkInBio={() => {
          setShowMobileCreateMenu(false);
          setActiveTab('link-in-bio');
        }}
      />

      {/* Mobile Link Wizard */}
      {showMobileLinkWizard && (
        <MobileLinkWizard
          onClose={() => setShowMobileLinkWizard(false)}
          onComplete={(linkData) => {
            console.log('Link created:', linkData);
            fetchUserData();
          }}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
